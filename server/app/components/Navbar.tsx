import Container from 'react-bootstrap/Container';
import NavbarBootstrap from 'react-bootstrap/Navbar';
import { useNavigate } from '../nav';
import { useCallback } from 'react';

export const Navbar = () => {
    const navigate = useNavigate();

    const openRootPage = useCallback(() => {
        navigate("/")
    }, [navigate])

    return (
        <NavbarBootstrap expand="lg" className="bg-body-tertiary">
            <Container>
                <NavbarBootstrap.Brand style={{ cursor: 'pointer' }} onClick={openRootPage}>TPC: Server</NavbarBootstrap.Brand>
            </Container>
        </NavbarBootstrap>
    )
}