import { useNavContext } from "./nav"
import { IndexPage } from "./pages/IndexPage";
import { PCPage } from "./pages/PCPage";

export const Content = () => {
    const nav = useNavContext();

    if (nav.path === '/') {
        return <IndexPage />
    }

    if (nav.path === '/pc') {
        return <PCPage pc={nav.params.pc} />
    }

    throw new Error("Unknown path: " + nav.path)
}