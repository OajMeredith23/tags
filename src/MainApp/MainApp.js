import React, { useState } from 'react'
import Nav from './Nav'
import AddNote, { AddOrEditModal } from './AddNote'
import { format } from 'date-fns'
import styled from 'styled-components'
import { ListItem, Pill, EditIcon, Message, Footer } from 'zyppd-components'
// import firebase from 'firebase'
export default function MainApp({ user, signOut, notes, userInfo }) {

    const [showEditModal, setShowEditModal] = useState(false)
    const [filter, setFilter] = useState({ type: false, value: false })

    return (
        <Container>
            <Nav signOut={signOut} userInfo={userInfo} setFilter={setFilter} />
            <Main>
                <div className="all-content">

                    <UL>
                        {notes && notes.length > 0 ? notes
                            .filter(note => {
                                if (filter.type === false) return note
                                if (filter.type === 'tags') return note[filter.type].includes(filter.value)
                                return note[filter.type] === filter.value
                            })
                            .sort((a, b) => a.createdAt - b.createdAt)
                            .map((note, i) => {
                                return (
                                    <ListItem
                                        key={`${note.source}-${i}`}
                                    >
                                        <div className="content">

                                            <small>Created: {format(new Date(note.createdAt), 'PPpp')}</small>
                                            <div className="title">
                                                <h4>{note.author}</h4>
                                                <h2>{note.source}</h2>
                                            </div>
                                            <p class="text">{note.text}</p>

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
                                                        {note.citation}
                                                    </small>
                                                </div>
                                            }
                                            {note.tags &&
                                                <ul className="tags">
                                                    {note.tags.map(tag => {
                                                        return (
                                                            <Pill>
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
                                                alignSelf: 'flex-start',
                                                justifySelf: 'flex-end',
                                                marginLeft: 'auto'
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

                    <AddNote user={user} />
                </div>

                <Footer />
            </Main>
        </Container >
    )
}

const Container = styled.div`
    .all-content{
        min-height: 100vh;
    }
    @media(min-width: 600px){
    display: grid; 
        grid-template-columns: minmax(150px, 1fr) 10fr;
    }
`
const Main = styled.div`
    grid-column: 2;
`
const UL = styled.div`
    padding: 1em;
    li { 
        .content {
            > * {
                margin-bottom: .1em;
            }
        }
        
        .title{
            margin: .5em 0;
        }
        .text{
            margin: 1em 0;
        }

        .link, .cite {
            margin: .5em 0
        }
        .tags{
            display: flex;
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