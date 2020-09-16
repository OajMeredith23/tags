import React, { useState } from 'react'
import styled from 'styled-components'
import { ListItem, PrimaryBtn, useWindowSize, Hamburger, Cross, RightArrow } from 'zyppd-components'
const NavStyles = styled.nav`
    grid-column: 1;
    height: 100vh; 
    position: fixed;
    left: 0;
    z-index: 20;
    background: ${({ theme }) => theme.foreground};
    @media(min-width:600px){
        position: sticky;
        
    }
    top: 0;
    box-shadow: ${({ theme }) => theme.shadow};
    padding: .5em;
    padding-top: 3em;
    .hamburger {
        position: fixed;
        top: .5em;
        left: .5em;
        z-index: 50;

    }
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    display: flex;
    transition: .2s ease-out;
    @media(max-width: 600px){
        transform: translate(-120%, 0);
        // max-width: 200px;
    }
    &.menu-toggled{
        transform: translate(0, 0);
    }
`

const MenuToggle = styled.div`
    position: fixed;
    top: .5em;
    left: .5em;
    z-index: 50;
`
export default function Nav({ user, signOut, userInfo, setFilter, filter, notes }) {
    const windowSize = useWindowSize()
    const [menuVisible, setMenuVisible] = useState(false)
    return (
        <>
            {windowSize.width < 600 &&
                <>
                    {menuVisible ?
                        <MenuToggle
                            onClick={() => setMenuVisible(!menuVisible)}
                        >
                            <Cross />
                        </MenuToggle>
                        : <MenuToggle
                            onClick={() => setMenuVisible(!menuVisible)}
                        >
                            <Hamburger />
                        </MenuToggle>
                    }
                </>
            }
            <NavStyles className={menuVisible ? 'menu-toggled' : ''}>

                <div>
                    {userInfo && userInfo.tags && userInfo.tags.length > 1 &&
                        <>
                            <h4
                                style={{
                                    margin: '.5em '
                                }}
                            >Tags</h4>
                            <ul>
                                <ListItem
                                    onClick={() => setFilter({ type: false, value: false })}

                                >
                                    {filter === false &&
                                        <RightArrow />
                                    }
                                    <strong>
                                        All Tags
                                </strong>
                                </ListItem>

                                {userInfo.tags.sort().map(tag => {
                                    const num = notes.filter(note => note.tags && note.tags.includes(tag)).length
                                    return (
                                        <ListItem
                                            key={tag}
                                            onClick={() => setFilter({ type: 'tags', value: tag })}

                                        >
                                            {tag === filter &&
                                                <RightArrow />
                                            }
                                            {tag}
                                            <NumOfTags>{num}</NumOfTags>
                                        </ListItem>
                                    )
                                })}
                            </ul>
                        </>
                    }
                    {userInfo && userInfo.authors && userInfo.authors.length > 1 &&
                        <>
                            <h4
                                style={{
                                    margin: '.5em '
                                }}
                            >Authors</h4>
                            <ul>
                                <ListItem
                                    onClick={() => setFilter({ type: false, value: false })}

                                >
                                    {filter === false &&
                                        <RightArrow />
                                    }
                                    <strong>
                                        All Authors
                                    </strong>
                                </ListItem>
                                {userInfo.authors.filter(author => author !== false).map(author => {
                                    return (
                                        <ListItem
                                            key={author}
                                            onClick={() => setFilter({ type: 'author', value: author })}
                                        >
                                            {author === filter &&
                                                <RightArrow />
                                            }
                                            {author}
                                        </ListItem>
                                    )
                                })}
                            </ul>
                        </>
                    }
                </div>
                {/* <PrimaryBtn
                    onClick={() => {
                        const refs = notes.filter(note => note.used === true).filter(note => note.citation).map(note => note.citation)
                        console.log(refs)
                    }}
                    fullWidth={true}
                    style={{
                        alignSelf: 'flex-end',
                        justifySelf: 'flex-end',
                        margin: 'auto 0 2em 0'
                    }}
                >
                    Create Bibliography
            </PrimaryBtn> */}
                <div
                    style={{
                        alignSelf: 'flex-end',
                        justifySelf: 'flex-end',
                        margin: 'auto 0 2em 0',
                        width: '100%'
                    }}
                >

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