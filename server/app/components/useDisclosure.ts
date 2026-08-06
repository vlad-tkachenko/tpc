import { useMemo, useState } from "react"

export const useDiscosure = () => {
    const [show, setShow] = useState(false)

    return useMemo(() => ({
        show,
        onClose: () => {
            setShow(false)
        },
        onOpen: () => {
            setShow(true)
        }
    }), [show, setShow])
}