import Container from 'react-bootstrap/Container';
import NavbarBootstrap from 'react-bootstrap/Navbar';
import { useNavigate } from '../nav';
import { useCallback } from 'react';
import Nav from 'react-bootstrap/Nav';
import { AsyncButton } from './AsyncButton';
import { API } from '../api/api';
import { VscDebug } from "react-icons/vsc";

export const Navbar = () => {
    const navigate = useNavigate();

    const openRootPage = useCallback(() => {
        navigate("/")
    }, [navigate])
    

    return (
        <NavbarBootstrap expand="lg" className="bg-body-tertiary">
            <Container>
                <NavbarBootstrap.Brand style={{ cursor: 'pointer' }} onClick={openRootPage}>TPC: Server</NavbarBootstrap.Brand>
                <Nav className="ms-auto">
                    <AsyncButton variant='dark' onClick={API.self.debug}>
                        <VscDebug />
                        <span>Debug</span>
                    </AsyncButton>
                </Nav>
            </Container>
        </NavbarBootstrap>
    )
}