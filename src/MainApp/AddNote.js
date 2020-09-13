import React, { useState } from 'react'
import { PrimaryBtn, PlusIcon, Modal, Input, TextArea, SecondaryBtn, Cross, useCheck } from 'zyppd-components'
import firebase from 'firebase'
import createUID from '../createUid'

export default function AddNote({ user }) {
    const [showModal, setShowModal] = useState(false)
    return (
        <>
            <PrimaryBtn
                onClick={() => setShowModal(!showModal)}
                style={{
                    position: 'fixed',
                    bottom: '2em',
                    left: '50%',
                    transform: 'translateX(-50%)'
                }}
            >
                <PlusIcon />
            </PrimaryBtn>
            {showModal &&
                <AddOrEditModal
                    isVisible={showModal}
                    user={user}
                    close={() => setShowModal(false)}
                >

                </AddOrEditModal>
            }
        </>
    )
}

export function AddOrEditModal({ isVisible, user, close, currNote = {}, notes = [] }) {
    const { requiresCheck } = useCheck(currNote)

    const [note, setNote] = useState(currNote)


    function handleChange(e) {
        e = e.target || e
        let val = e.value;

        if (e.name === 'tags') { val = (e.value.split(', ')) }
        setNote(prevState => {
            return {
                ...prevState,
                [e.name]: val
            }
        })
    }

    const db = firebase.firestore()

    async function Add() {
        const query = db.collection(`users/${user.uid}/notes`)
        let id = createUID(10)

        const tags = await db.collection(`users`).doc(user.uid).get().then(doc => doc.data().tags)
        const t = note.tags ? note.tags : []
        const allTags = [...tags, ...t]
        const newTags = allTags.filter((tag, i) => allTags.indexOf(tag) === i)
        // allAuthors.splice(0, allAuthors.length, ...(new Set(allAuthors)))

        const a = note.author ? note.author : false
        const authors = await db.collection(`users`).doc(user.uid).get().then(doc => doc.data().authors)
        const allAuthors = ([...authors, a])
        const newAuthors = allAuthors.filter((tag, i) => allAuthors.indexOf(tag) === i)


        db.collection(`users`).doc(user.uid).update({ tags: newTags, authors: newAuthors })

        currNote.id ? query.doc(currNote.id).update({
            ...note
        })
            .then(() => {
                close()
            })
            :
            query.doc(id).set({
                ...note,
                createdAt: new Date().getTime(),
                id
            })
                .then(() => {
                    close()
                });


    }

    function handleDelete() {

        // const withRemovedNote = notes.filter(note => note.id !== currNote.id)
        db.collection(`users/${user.uid}/notes`).doc(currNote.id).delete()
        close()
    }

    return (
        <Modal
            isVisible={isVisible}
            close={close}
            shade={true}
        >
            <h3>Add Note</h3>
            <Input
                type="text"
                name="source"
                value={currNote.source ? currNote.source : ''}
                message={'Source Title'}
                placeholder="Brave New World"
                validationNeeded={false}
                handleInput={handleChange}
            />
            <Input
                type="text"
                name="author"
                value={currNote.author ? currNote.author : ''}
                message={'Author'}
                placeholder="Aldous Huxley"
                validationNeeded={false}
                handleInput={handleChange}
            />
            <Input
                type="number"
                name="page_number"
                value={currNote.page_number ? currNote.page_number : ''}
                message={'Page Number'}
                placeholder="101"
                validationNeeded={false}
                handleInput={handleChange}
            />
            <TextArea
                type="text"
                name="text"
                value={currNote.text}
                message="Citation"
                placeholder="“Words can be like X-rays if you use them properly -- they’ll go through anything. You read and you’re pierced.” "
                handleInput={handleChange}
            />

            <TextArea
                type="text"
                name="thoughts"
                value={currNote.thoughts}
                message="Thoughts"
                placeholder="Brave New World explores the dehumanizing effects of technology, and implies that pain is necessary for life to have meaning. "
                handleInput={handleChange}
            />
            <Input
                type="text"
                name="tags"
                value={currNote.tags ? currNote.tags.join(', ') : ''}
                message={'Tags (separate with commas)'}
                placeholder="Science Fiction, Prescience"
                validationNeeded={false}
                handleInput={handleChange}
            />
            <Input
                type="text"
                name="link"
                value={currNote.link ? currNote.link : ''}
                message={'Link'}
                placeholder="https://en.wikipedia.org/wiki/Brave_New_World"
                validationNeeded={false}
                handleInput={handleChange}
            />
            <Input
                type="text"
                name="citation"
                value={currNote.citation ? currNote.citation : ''}
                message={'Reference'}
                placeholder="Huxley, A., n.d. Brave New World, Aldous Huxley."
                validationNeeded={false}
                handleInput={handleChange}
            />
            <PrimaryBtn
                onClick={() => Add()}
                style={{ margin: '1em 0' }}
            >
                Add Note
            </PrimaryBtn>
            {currNote.id &&
                <SecondaryBtn
                    style={{ margin: '1em 0' }}
                    onClick={() => requiresCheck(`Are you sure you wish to remove this note?`, () => handleDelete())}
                >
                    Delete
                <Cross />
                </SecondaryBtn>
            }
        </Modal>
    )
}