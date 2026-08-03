import { createContext, useCallback, useContext, useMemo, useState, type PropsWithChildren } from "react";

interface NavContext {
    path: string,
    params: Record<string, any>,
    navigate: (path: string, params?: Record<string, any>) => void;
}

const NavContext = createContext<NavContext | undefined>(undefined)

export const useNavContext = () => {
    const ctx = useContext(NavContext);
    if (!ctx) throw new Error('useNavContext should have a parent <NavProvider> component');

    return ctx;
};

export const useNavigate = (): (path: string, params?: Record<string, any>) => void => {
    const ctx = useNavContext()
    return ctx.navigate
}

export const NavProvider = (props: PropsWithChildren) => {
    const [path, setPath] = useState("/")
    const [params, setParams] = useState<Record<string, any>>({})

    const navigate = useCallback((path: string, params?: Record<string, any>) => {
        setPath(path)
        setParams(params || {})
    }, [setPath, setParams])

    const ctx = useMemo(() => ({
        path,
        params,
        navigate
    }), [path, params, navigate])

    return <NavContext.Provider value={ctx}>
        {props.children}
    </NavContext.Provider>
}