export const fetchUserById = async ({ signal, queryKey }: { signal?: AbortSignal; queryKey: any[] }) => {
  const [, id] = queryKey;
  const res = await fetch(`http://localhost:3001/api/v1/user/${id}`, {
    method: "GET",
    headers: { "Accept": "application/json" },
    signal,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Error fetching user: ${res.status} ${text}`);
  }
  return res.json();
};