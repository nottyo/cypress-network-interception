import axios from 'axios'
import { useEffect, useState } from "react"
import { Pagination } from 'react-bootstrap'
import swal from 'sweetalert'
import './Home.css'
import 'bootstrap/dist/css/bootstrap.min.css'


export default function Home() {
  const [data, setData] = useState({})
  const getUsers = async (page = 1) => {
    try {
      const params = {
        page,
      }
      const { data } = await axios.get('https://reqres.in/api/users', { params })
      setData(data)
    } catch (error) {
      swal({
        icon: 'error',
        title: 'ERROR',
        text: error.message,
      })
    }
  }

  const handlePaginationClick = (e) => {
    const page = e.target.innerHTML
    getUsers(page)
  }

  useEffect(() => {
    getUsers()
  }, [])
  let activePage = data.page || 1
  let items = []
  for (let number = 1; number <= data.total_pages; number++) {
    items.push(
      <Pagination.Item key={number} active={number === activePage} data-testid={`page-${number}`}>
        {number}
      </Pagination.Item>,
    )
  }

  return (
    <div className="App">
      <h1>Hello users!</h1>
        <div className="flex">
          {data.data &&
            data.data.map((user) => {
              return (
                <div key={user.id}>
                  <p>
                    <strong data-testid="firstname">{user.first_name}</strong>
                  </p>
                  <p data-testid="email">{user.email}</p>
                  <img key={user.avatar} src={user.avatar} alt={user.email} data-testid="avatar" />
                </div>
              );
            })}
        </div>
        <div className="flex">
          <Pagination onClick={(e) => handlePaginationClick(e)}>{items}</Pagination>
          <br />
        </div>
    </div>
  )
}
