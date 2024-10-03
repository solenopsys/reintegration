import { RoleType } from "../structs"

 
export const ROLE_DEFAULT = (name: string): RoleType => {
    return {
        apiVersion: 'rbac.authorization.k8s.io/v1',
        kind: 'Role',
        metadata: {
            name,
        },
        rules: []
    } as RoleType
}   