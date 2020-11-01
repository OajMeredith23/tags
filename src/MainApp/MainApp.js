import React, { useEffect, useState } from 'react'
import Nav from './Nav'
import AddNote, { AddOrEditModal } from './AddNote'
import { format } from 'date-fns'
import styled from 'styled-components'
import { ListItem, Pill, EditIcon, Message, Footer, Group, StarIcon, PrimaryBtn } from 'zyppd-components'
import { AnimatePresence } from 'framer-motion'
import dompurify from 'dompurify'

// import firebase from 'firebase'
export default function MainApp({ user, signOut, notes, userInfo }) {
    const sanitizer = dompurify.sanitize;

    const [showEditModal, setShowEditModal] = useState(false)

    const [chosenTags, setChosenTags] = useState([])
    const [chosenAuthors, setChosenAuthors] = useState([])

    function setTags(tag) {

        if (tag === false) return setChosenTags([])

        setChosenTags(prevState => {
            return prevState.includes(tag) ? prevState.filter(t => t !== tag) : [...prevState, tag]

        })
    }
    function setAuthors(author) {
        if (author === false) return setChosenAuthors([])

        setChosenAuthors(prevState => {
            return prevState.includes(author) ? prevState.filter(t => t !== author) : [...prevState, author]
        })
    }

    const [selectedNotes, setSelectedNotes] = useState([])
    const [availableAuthors, setAvailableAuthors] = useState([])

    useEffect(() => {
        const sortedNotes = notes && notes.filter(note => {

            if (chosenTags.length === 0) return note
            if (chosenTags) {
                return note.tags && chosenTags.every(t => note.tags.includes(t))
            }
            return note
        })
            .filter(note => {
                if (chosenAuthors.length === 0) return note
                if (chosenAuthors) {
                    return note.author && chosenAuthors.includes(note.author)
                }
                return note
            })
            .sort((a, b) => b.createdAt - a.createdAt)

        sortedNotes && setAvailableAuthors(Array.from(new Set(sortedNotes.map(note => note.author))))
        setSelectedNotes(sortedNotes)
    }, [chosenTags, chosenAuthors, notes])

    return (
        <Container>
            <Nav
                signOut={signOut}
                user={userInfo}
                setChosenAuthors={setAuthors}
                chosenAuthors={chosenAuthors}
                availableAuthors={availableAuthors}

                notes={selectedNotes}
                setTags={setTags}
                chosenTags={chosenTags}
            />
            <Main>
                <div className="all-content">
                    <AnimatePresence>
                        <UL>
                            {notes && notes.length > 0 &&
                                <Group>
                                    <p><strong>{selectedNotes.length}</strong> notes</p>
                                    {selectedNotes && <p><strong>{Array.from(new Set(selectedNotes.map(note => note.author))).length}</strong> authors</p>}
                                    {selectedNotes && <p><strong>{Array.from(new Set(selectedNotes.map(note => note.tags).flat())).length}</strong> tags</p>}
                                </Group>
                            }
                            {chosenAuthors.length > 0 || chosenTags.length > 0 ?
                                <Group>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginRight: '1em'
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                marginRight: '1em'
                                                // justifyContent: 'space-between'
                                            }}
                                        >
                                            {chosenTags.length > 0 &&
                                                <>
                                                    <div style={{ marginRight: '1em' }}>
                                                        <h4
                                                            style={{ marginBottom: '.5em' }}
                                                        >Tags</h4>
                                                        <div
                                                            style={{ display: 'flex', flexWrap: 'wrap', gap: '.25em' }}
                                                        >
                                                            {chosenTags.map((tag) => <Pill key={tag} onClick={() => setTags(tag)}>{tag}</Pill>)}
                                                        </div>
                                                    </div>
                                                </>
                                            }
                                            {chosenAuthors.length > 0 &&
                                                <>
                                                    <div>
                                                        <h4
                                                            style={{ marginBottom: '.5em' }}
                                                        >Authors</h4>
                                                        <div
                                                            style={{ display: 'flex', flexWrap: 'wrap' }}
                                                        >
                                                            {chosenAuthors.map((author) => <Pill key={author} onClick={() => setAuthors(author)}>{author}</Pill>)}
                                                        </div>
                                                    </div>
                                                </>
                                            }
                                        </div>
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <PrimaryBtn
                                                type="warning"
                                                onClick={() => {
                                                    setChosenAuthors([])
                                                    setChosenTags([])
                                                }}
                                            >
                                                Clear Selection
                                        </PrimaryBtn>
                                        </div>
                                    </div>
                                </Group> : ''
                            }

                            {selectedNotes && selectedNotes.length > 0 ?

                                selectedNotes.map((note, i) => {
                                    return (
                                        <ListItem
                                            key={`${note.source}-${i}–${Math.random()}`}
                                            initial={{ opacity: 0, y: 50 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -50 }}
                                        >
                                            <div className="content">

                                                <div className="title">
                                                    <div className="source">
                                                        {note.used && <StarIcon />}
                                                        <div>
                                                            <small>Created: {format(new Date(note.createdAt), 'PPpp')}</small>
                                                            <h3
                                                                style={{ opacity: '0.8' }}
                                                            >
                                                                {note.author}
                                                            </h3>
                                                            <h2>
                                                                {note.source}
                                                            </h2>
                                                            {note.page_number && <p>Page: {note.page_number}</p>}
                                                        </div>
                                                    </div>
                                                </div>
                                                {note.text &&
                                                    <div className="text">
                                                        <p
                                                            dangerouslySetInnerHTML={{ __html: sanitizer(note.text.replace(/\n/g, '<br/>')) }}
                                                        >
                                                            {/* {note.text && note.text.replace('\n', '<br/>')}</p> */}
                                                        </p>
                                                    </div>
                                                }
                                                {note.thoughts &&
                                                    <div
                                                        className="thoughts"
                                                    >
                                                        <strong>Thoughts</strong>
                                                        <p>
                                                            {note.thoughts}
                                                        </p>
                                                    </div>
                                                }

                                                {note.link &&
                                                    <div className="link">
                                                        <a href={note.link}
                                                            style={{
                                                                textDecoration: "underline"
                                                            }}
                                                        >
                                                            <small>
                                                                {note.link}
                                                            </small>
                                                        </a>

                                                    </div>
                                                }
                                                {note.citation &&
                                                    <div
                                                        className="cite"
                                                    >
                                                        <small >
                                                            <i>
                                                                {note.citation}
                                                            </i>
                                                        </small>
                                                    </div>
                                                }

                                                {note.tags &&
                                                    <ul className="tags">
                                                        {note.tags.map((tag, i) => {
                                                            return (
                                                                <Pill
                                                                    key={`${tag}-${i}`}
                                                                    style={{
                                                                        cursor: 'pointer'
                                                                    }}
                                                                    onClick={() => setTags(tag)}
                                                                >
                                                                    {tag}
                                                                </Pill>
                                                            )
                                                        })}
                                                    </ul>
                                                }
                                            </div>
                                            <EditIcon
                                                onClick={() => setShowEditModal(note)}
                                                style={{
                                                    // alignSelf: 'flex-start',
                                                    // justifySelf: 'flex-end',
                                                    // marginLeft: 'auto'
                                                    position: 'absolute',
                                                    top: '1em',
                                                    right: '1em'
                                                }}
                                            />
                                        </ListItem>
                                    )
                                })
                                : <Message
                                    fullWidth={true}
                                    style={{
                                        margin: '4em 0'
                                    }}
                                >
                                    No notes yet, add one to get started
                        </Message>
                            }
                            {!!showEditModal &&
                                <AddOrEditModal
                                    user={user}
                                    isVisible={!!showEditModal}
                                    close={() => setShowEditModal(false)}
                                    currNote={showEditModal}
                                    notes={notes}
                                />
                            }

                        </UL>
                    </AnimatePresence>

                    <AddNote user={user} />
                </div>

                <Footer />
            </Main>
        </Container >
    )
}

const Container = styled.div`
`
const Main = styled.div`
    padding-top: 3.75em;
    max-width: 900px;
    margin: 0 auto;  
    .all-content{
        max-width: 900px;  
    }
`
const UL = styled.div`
    padding: 1em;
    p, a, small, i {
        width: 100%;
        max-width: 75ch;
    }
    li { 
        .content {
            > * {
                margin-bottom: .1em;
            }
        }
        
        .title{
            margin: .5em 0;
        }
        .source{
            display: flex;
            align-items: center;
        }
        .text{
            margin: 1em 0;
        }

        .link, .cite {
            margin: .5em 0
        }
        .tags{
            display: flex;
            flex-wrap: wrap;
            gap: .25em;
            margin-top: 1em;
            div {
                @supports not(gap: .25em){
                    margin: .25em;
                }
            }
        }
    }
`


