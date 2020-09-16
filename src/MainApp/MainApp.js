import React, { useState } from 'react'
import Nav from './Nav'
import AddNote, { AddOrEditModal } from './AddNote'
import { format } from 'date-fns'
import styled from 'styled-components'
import { ListItem, Pill, EditIcon, Message, Footer, Group } from 'zyppd-components'
// import firebase from 'firebase'
export default function MainApp({ user, signOut, notes, userInfo }) {

    const [showEditModal, setShowEditModal] = useState(false)
    const [filter, setFilter] = useState({ type: false, value: false })

    return (
        <Container>
            <Nav signOut={signOut} userInfo={userInfo} setFilter={setFilter} filter={filter.value} notes={notes} />
            <Main>
                <div className="all-content">

                    <UL>
                        {notes && notes.length > 0 &&
                            <Group>
                                <p><strong>{notes.length}</strong> notes</p>
                                {userInfo && userInfo.tags && <p><strong>{userInfo.tags.length}</strong> tags</p>}
                                {userInfo && userInfo.authors && <p><strong>{userInfo.authors.length}</strong> authors</p>}
                            </Group>
                        }
                        {notes && notes.length > 0 ? notes
                            .filter(note => {
                                if (filter.type === false) return note
                                if (filter.type === 'tags') return note[filter.type] && note[filter.type].includes(filter.value)
                                return note[filter.type] === filter.value
                            })
                            .sort((a, b) => b.createdAt - a.createdAt)
                            .map((note, i) => {
                                return (
                                    <ListItem
                                        key={`${note.source}-${i}`}

                                    >
                                        <div className="content">

                                            <small>Created: {format(new Date(note.createdAt), 'PPpp')}</small>
                                            <div className="title">
                                                <h3
                                                    style={{ opacity: '0.8' }}
                                                >{note.author}</h3>
                                                <h2>{note.source}</h2>
                                                {note.page_number && <p>Page: {note.page_number}</p>}
                                            </div>
                                            <div className="text">
                                                <p>{note.text}</p>
                                            </div>

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
                                                                onClick={() => setFilter({ type: 'tags', value: tag })}
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
        grid-template-columns: minmax(max-content, 1fr) 10fr;
    }
`
const Main = styled.div`
    grid-column: 2;
    padding-top: 3.75em;
    .all-content{
        max-width: 900px;  
        margin: 0 auto;
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


