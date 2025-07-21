import { Navigate } from 'react-router-dom'
import { ReactNode } from 'react'
import { useAuthContext } from '@/context/AuthContextProvider'
import { UserType } from '@/lib/types'

interface ProtectedRouteProps {
    requiredRole?: UserType
    children: ReactNode
}

const ProtectedRoute = ({ requiredRole, children }: ProtectedRouteProps ) => {
    const { userProfileInfo } = useAuthContext()

    if (requiredRole && userProfileInfo?.userType !== requiredRole) {
        return <Navigate to="/not-authorized" replace />
    }

    return <>{children}</>
}

export default ProtectedRoute
