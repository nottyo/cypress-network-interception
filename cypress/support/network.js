const network = {
  users: {
    getUsers: {
      routeMatcher: {
        method: 'GET',
        path: '/api/users*',
      },
      alias: 'getUsers'
    }
  }
}

export default network