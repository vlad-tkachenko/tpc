import { useNavContext } from "./nav"
import { IndexPage } from "./pages/IndexPage";

export const Content = () => {
    const nav = useNavContext();

    if (nav.path === '/') {
        return <IndexPage />
    }

    throw new Error("Unknown path: " + nav.path)
}