import type { PropsWithChildren } from "react";
import Container from "react-bootstrap/Container";
import { Navbar } from "./components/Navbar";

export const Layout = (props: PropsWithChildren) => {
    return (
        <>
            <Navbar />
            <Container>
                {props.children}
            </Container>
        </>
    )
}