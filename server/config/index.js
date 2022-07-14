module.exports = {
    port: 3001,
    db: {
        user: 'Raza',
        password: '123',
        dbName: 'cmsDb',
        port: '27017'
    },
    TOKEN_KEY: 'longSecretKey',
    PERMISSIONS: {
        can_see_posts: ['/get-posts'],
        can_see_categories: ['/get-categories'],
        can_admin_posts: ['/create-post', '/update-post', '/delete-post'],
        can_admin_categories: ['/create-category', '/update-category', '/delete-category']
    }
}