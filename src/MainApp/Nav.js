import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { ListItem, PrimaryBtn, useWindowSize, RightArrow, RightChevron, LeftChevron, SecondaryBtn, Modal } from 'zyppd-components'
import dompurify from 'dompurify'
const NavStyles = styled.nav`
    position: fixed; 
    top: 0;
    left: 0;
    height: 100vh; 
    position: fixed;
    left: 0;
    z-index: 20;
    width: 300px;
    background: ${({ theme }) => theme.foreground};
    top: 0;
    box-shadow: ${({ theme }) => theme.shadow};
    padding: .5em;
    padding-top: 4em;
    .hamburger {
        position: fixed;
        top: .5em;
        left: .5em;
        z-index: 50;

    }
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    transition: .2s ease-out;
    transform: translate(-80%, 0);
    opacity: 0;
    &.menu-toggled{
        opacity: 1;
        transform: translate(0, 0);
    }
`

const MenuToggle = styled.div`
    position: fixed;
    top: .5em;
    left: .5em;
    z-index: 50;
`
export default function Nav({ user, signOut, userInfo, setChosenAuthors, chosenAuthors, availableAuthors, setTags, chosenTags, notes }) {

    const windowSize = useWindowSize()
    const [menuVisible, setMenuVisible] = useState(false)
    const [tags, setAllTags] = useState([])
    const [authors, setAllAuthors] = useState([])
    const [bibliography, setBibliography] = useState(false);

    useEffect(() => {
        console.log('bibliography')
        console.log(bibliography)
    }, [bibliography])


    useEffect(() => {
        // Get all the tags from the loaded notes
        const allTags = notes && notes.filter(note => note.tags).map(note => note.tags).flat()
        const allAuthors = notes && notes.filter(note => note.author).map(note => note.author).flat()
        allTags && setAllTags(Array.from(new Set(allTags)))
        allTags && setAllAuthors(Array.from(new Set(allAuthors)))
    }, [notes])

    const sanitizer = dompurify.sanitize;

    return (
        <>


            {windowSize.width < 6000 &&
                <>
                    {menuVisible ?
                        <MenuToggle
                            onClick={() => setMenuVisible(!menuVisible)}
                        >
                            <SecondaryBtn>
                                <LeftChevron />
                            </SecondaryBtn>
                        </MenuToggle>
                        : <MenuToggle
                            onClick={() => setMenuVisible(!menuVisible)}
                        >
                            <SecondaryBtn>
                                <RightChevron />
                            </SecondaryBtn>
                        </MenuToggle>
                    }
                </>
            }
            {bibliography &&
                <Modal
                    isVisible={!!bibliography}
                    close={() => setBibliography(false)}
                    shade={true}
                >
                    {/* {sanitizer(bibliography)} */}
                    <p
                        className="description"
                        dangerouslySetInnerHTML={{ __html: sanitizer(bibliography) }}
                    />
                </Modal>
            }
            <NavStyles className={menuVisible ? 'menu-toggled' : ''}>

                <div>


                    {chosenAuthors.length > 0 || chosenTags.length > 0 ?
                        <PrimaryBtn
                            type="warning"
                            fullWidth={true}
                            onClick={() => {
                                setChosenAuthors(false)
                                setTags(false)
                            }}
                        >
                            Clear Selection
                        </PrimaryBtn>
                        : ''
                    }
                    {tags.length > 0 &&
                        <>
                            <h4
                                style={{
                                    margin: '.5em '
                                }}
                            >Tags</h4>
                            <ul>
                                <ListItem
                                    onClick={() => setTags(false)}

                                >
                                    {chosenTags.length === 0 ?
                                        <RightArrow /> : ''
                                    }
                                    <strong>
                                        All Tags
                                </strong>
                                </ListItem>

                                {tags.length > 0 && tags.sort().map(tag => {

                                    const num = () => {
                                        const result = notes.filter(note => note.tags && note.tags.includes(tag))
                                        return result.filter(note => chosenTags.every(t => note.tags.includes(t))).length
                                    }

                                    return num() > 0 && (
                                        <ListItem
                                            key={tag}
                                            onClick={num() > 0 ? () => setTags(tag) : null}
                                            type={num() === 0 ? 'disabled' : null}
                                        >
                                            {chosenTags.includes(tag) &&
                                                <RightArrow />
                                            }
                                            {tag}
                                            <NumOfTags>{num()}</NumOfTags>
                                        </ListItem>
                                    )
                                })}
                            </ul>
                        </>
                    }
                    {availableAuthors.length > 0 &&
                        <>
                            <h4
                                style={{
                                    margin: '.5em '
                                }}
                            >Authors</h4>
                            <ul>
                                <ListItem
                                    onClick={() => setChosenAuthors(false)}
                                >
                                    {chosenAuthors && chosenAuthors.length === 0 ?
                                        <RightArrow /> : ''
                                    }
                                    <strong>
                                        All Authors
                                    </strong>
                                </ListItem>
                                {
                                    availableAuthors.filter(author => author !== false)
                                        .sort()
                                        .map((author, i) => {
                                            const num = () => {
                                                const result = notes.filter(note => note.author === author).length
                                                return result
                                            }
                                            return (
                                                <ListItem
                                                    key={`${author}_${i}`}
                                                    onClick={() => setChosenAuthors(author)}
                                                >
                                                    {chosenAuthors.includes(author) &&
                                                        <RightArrow />
                                                    }
                                                    {author}
                                                    <NumOfTags>{num()}</NumOfTags>

                                                </ListItem>
                                            )
                                        })}
                            </ul>
                        </>
                    }
                </div>

                <div
                    style={{
                        alignSelf: 'flex-end',
                        justifySelf: 'flex-end',
                        margin: 'auto 0 2em 0',
                        width: '100%'
                    }}
                >
                    <PrimaryBtn

                        onClick={() => {
                            let refs = notes
                                // .filter(note => note.used === true)
                                .filter(note => note.citation)
                                .map(note => note.citation)
                                .sort()
                            refs = Array.from(new Set(refs))
                            setBibliography(refs.join(" <br/>  <br/> "))
                        }}

                        fullWidth={true}
                        style={{
                            alignSelf: 'flex-end',
                            justifySelf: 'flex-end',
                            margin: 'auto 0 2em 0'
                        }}
                    >
                        View Bibliography
</PrimaryBtn>

                    <PrimaryBtn
                        onClick={() => signOut()}
                        type="warning"
                        fullWidth={true}
                        style={{
                            // alignSelf: 'flex-end',
                            // justifySelf: 'flex-end',
                            margin: '1em 0 2em 0'
                        }}
                    >
                        Sign Out
            </PrimaryBtn>
                </div>

            </NavStyles>
        </>
    )
}

const NumOfTags = styled.div`
    font-size: .8em;
    opacity: .5;
    width: 1.5em;
    height: 1.5em;
    margin-right: -.5em;
    padding-left: .5em;
    border-radius: 50%;
    justify-self: flex-end;
    align-self: flex-end;
    margin-left: auto;
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
`