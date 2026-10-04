import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import type { User } from "../../lib/supabase.types";
import type { UserRole } from "../login/types";

const loadUsers = () => supabase.auth.admin.listUsers();

export function useAdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadUsers().then(({ data, error }) => {
      setUsers(data.users);
      setError(error?.message ?? "");
      setLoading(false);
    })
  }, []);

  async function createUser(input: { email: string; password: string; role: UserRole }) {
    const { data, error } = await supabase.auth.admin.createUser(input);
    const created = data.user;

    if (created) setUsers((us) => [...us, created]);

    return error;
  }

  async function reload() {
    const { data } = await loadUsers();
    setUsers(data.users);
  }

  async function setRole(id: string, role: UserRole) {
    setUsers((us) => us.map((u) => (u.id === id ? { ...u, role } : u)));
    const { error } = await supabase.auth.admin.updateUserById(id, { role });

    if (error) {
      setError(error.message);
      reload();
    }
  }

  return { users, loading, error, createUser, setRole, reload };

}