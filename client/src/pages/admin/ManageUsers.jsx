import { useState, useMemo } from "react";
import { useUsers } from "./hooks/useUsers";
import SortableTh from "./components/SortableTh";
import UserModal from "../../components/modal/UserModal";

export default function ManageUsers() {
  const token = localStorage.getItem("token");
  const { users, loading, error, deleteUser, fetchUsers } = useUsers(token);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [modalUser, setModalUser] = useState(null);

  const sortedUsers = useMemo(() => {
    let sorted = [...users];
    if (sortConfig.key) {
      sorted.sort((a,b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        if (typeof aVal === "string") aVal = aVal.toLowerCase();
        if (typeof bVal === "string") bVal = bVal.toLowerCase();
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [users, sortConfig]);

  const filteredUsers = sortedUsers.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  return (
    <>
      <NavBar />
      <main>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." />
        <button onClick={() => setModalUser({})}>Add New User</button>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        <table>
          <thead>
            <tr>
              <SortableTh label="ID" sortKey="id" sortConfig={sortConfig} onSort={toggleSort} />
              <SortableTh label="Username" sortKey="username" sortConfig={sortConfig} onSort={toggleSort} />
              <SortableTh label="Email" sortKey="email" sortConfig={sortConfig} onSort={toggleSort} />
              {/* Add more columns */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr><td colSpan={4}>No users found</td></tr>
            ) : (
              filteredUsers.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>
                    <button onClick={() => setModalUser(u)}>Edit</button>
                    <button onClick={() => deleteUser(u.id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <UserModal
          user={modalUser}
          onClose={() => setModalUser(null)}
          onSave={() => fetchUsers()}
          token={token}
        />
      </main>
      <Footer />
    </>
  );
}
