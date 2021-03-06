import React, { useState, useEffect } from 'react'
import { PrimaryBtn, PlusIcon, Modal, Input, TextArea, SecondaryBtn, Cross, useCheck, Checkbox, Group } from 'zyppd-components'
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
    console.log(currNote)
    const { requiresCheck } = useCheck(currNote)

    const [used, setUsed] = useState(currNote.used)

    const [note, setNote] = useState(currNote)

    function handleChange(e) {
        e = e.target || e
        let val = e.value;
        console.log(val)

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


        let hasBeenUsed = used || false
        currNote.id ? query.doc(currNote.id).update({
            ...note,
            used: hasBeenUsed
        })
            .then(() => {
                close()
            })
            :
            query.doc(id).set({
                ...note,
                used: hasBeenUsed,
                createdAt: new Date().getTime(),
                id
            })
                .then(() => {
                    close()
                });


    }

    function handleDelete() {

        db.collection(`users/${user.uid}/notes`).doc(currNote.id).delete()
        close()
    }

    return (
        <Modal
            isVisible={isVisible}
            close={() => {
                close()
                Object.entries(note).length > 0 && Add()
            }}
            shade={true}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <SecondaryBtn
                    onClick={close}
                    style={{
                        marginRight: '1em'
                    }}
                >
                    <Cross />
                </SecondaryBtn>
                <h3>Add Note</h3>
            </div>
            <div
                style={{
                    margin: '1em 0 2.5em .5em'
                }}
            >
                <Checkbox
                    checked={used}
                    onClick={() => setUsed(!used)}
                    label="Cited"
                ></Checkbox>
            </div>
            <Input
                type="text"
                name="source"
                value={currNote.source ? currNote.source : ''}
                message={'Source Title'}
                placeholder="Brave New World"
                // useStorage={true}

                validationNeeded={false}
                handleInput={handleChange}
            />
            <Input
                type="text"
                name={`author`}
                value={currNote.author ? currNote.author : ''}
                message={'Author'}
                // useStorage={true}
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
                message="Excerpt"
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
                {`${currNote && currNote.id ? 'Update' : 'Add'} Note`}
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

function getLocalStorage(name) {
    return localStorage.getItem(name);
}