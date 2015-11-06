
export default new class UserResource {

    create(data:Object):Promise {
        return Promise.resolve({
            success: true,
            user: {
                id: 1,
                name: 'User'
            }
        })
    }

    logout():Promise {
        return Promise.resolve({
            success: true
        })
    }
}