import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { firebaseAuth, googleProvider } from "../firebase";
import "../styles/cd-manager.css";

type CD = {
  id: number;
  name: string;
  artist: string;
  have: boolean;
};

type Filter = "all" | "have" | "wanted";
type CDFields = Omit<CD, "id">;

const EMPTY_CD: CDFields = { name: "", artist: "", have: false };

async function readError(response: Response): Promise<string> {
  try {
    const body = await response.json();
    return typeof body.detail === "string" ? body.detail : "Something went wrong.";
  } catch {
    return "Something went wrong.";
  }
}

async function authenticatedFetch(path: string, init: RequestInit = {}, user?: User) {
  const currentUser = user ?? firebaseAuth.currentUser;
  if (!currentUser) throw new Error("Authentication required.");

  const idToken = await currentUser.getIdToken();
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${idToken}`);
  return fetch(path, { ...init, headers, cache: "no-store" });
}

export default function CdManager() {
  const [auth, setAuth] = useState<"loading" | "signed-out" | "signed-in">("loading");
  const [cds, setCds] = useState<CD[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [newCd, setNewCd] = useState<CDFields>(EMPTY_CD);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<CD | null>(null);
  const [busyId, setBusyId] = useState<number | "add" | "login" | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (!active) return;
      if (!user) {
        setCds([]);
        setAuth("signed-out");
        return;
      }

      try {
        const response = await authenticatedFetch("/cd-api/cds", {}, user);
        if (!response.ok) throw new Error(await readError(response));
        const collection: CD[] = await response.json();
        if (!active) return;
        setCds(collection);
        setError("");
        setAuth("signed-in");
      } catch (caught) {
        if (active) {
          setError(caught instanceof Error ? caught.message : "Could not sign in.");
          setAuth("signed-out");
        }
        await signOut(firebaseAuth);
      }
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const ownedCount = cds.filter((cd) => cd.have).length;
  const visibleCds = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return cds.filter((cd) => {
      const matchesFilter = filter === "all" || (filter === "have" ? cd.have : !cd.have);
      const matchesQuery = !normalizedQuery
        || cd.name.toLocaleLowerCase().includes(normalizedQuery)
        || cd.artist.toLocaleLowerCase().includes(normalizedQuery);
      return matchesFilter && matchesQuery;
    });
  }, [cds, filter, query]);

  const logIn = async () => {
    setBusyId("login");
    setError("");
    try {
      await signInWithPopup(firebaseAuth, googleProvider);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not sign in.");
    } finally {
      setBusyId(null);
    }
  };

  const logOut = async () => {
    await signOut(firebaseAuth);
    setCds([]);
    setAuth("signed-out");
    setError("");
  };

  const createCd = async (event: FormEvent) => {
    event.preventDefault();
    setBusyId("add");
    setError("");
    try {
      const response = await authenticatedFetch("/cd-api/cds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCd),
      });
      if (!response.ok) throw new Error(await readError(response));
      const created: CD = await response.json();
      setCds((current) => [...current, created]);
      setNewCd(EMPTY_CD);
      setShowAdd(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not add the CD.");
    } finally {
      setBusyId(null);
    }
  };

  const saveCd = async (cd: CD) => {
    setBusyId(cd.id);
    setError("");
    try {
      const response = await authenticatedFetch(`/cd-api/cds/${cd.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: cd.name, artist: cd.artist, have: cd.have }),
      });
      if (response.status === 401) {
        setAuth("signed-out");
        throw new Error("Your session expired. Sign in again.");
      }
      if (!response.ok) throw new Error(await readError(response));
      const updated: CD = await response.json();
      setCds((current) => current.map((item) => item.id === updated.id ? updated : item));
      setEditing(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not update the CD.");
    } finally {
      setBusyId(null);
    }
  };

  const removeCd = async (cd: CD) => {
    if (!window.confirm(`Remove “${cd.name}” by ${cd.artist}?`)) return;
    setBusyId(cd.id);
    setError("");
    try {
      const response = await authenticatedFetch(`/cd-api/cds/${cd.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error(await readError(response));
      setCds((current) => current.filter((item) => item.id !== cd.id));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not remove the CD.");
    } finally {
      setBusyId(null);
    }
  };

  if (auth !== "signed-in") {
    return (
      <main className="cd-login">
        <section className="cd-login__card" aria-labelledby="cd-login-title">
          <div className="cd-logo" aria-hidden="true"><span>CD</span><i /></div>
          <p className="cd-eyebrow">Private collection</p>
          <h1 id="cd-login-title">CDinja</h1>
          <p className="cd-login__intro">Sign in to manage the shelves.</p>
          {auth === "loading" ? (
            <p className="cd-loading" role="status">Checking session…</p>
          ) : (
            <button
              className="cd-google-signin"
              type="button"
              onClick={() => void logIn()}
              disabled={busyId === "login"}
            >
              <span aria-hidden="true">G</span>
              {busyId === "login" ? "Signing in…" : "Continue with Google"}
            </button>
          )}
          {error && <p className="cd-error" role="alert">{error}</p>}
          <a className="cd-back" href="/">← Back to portfolio</a>
        </section>
      </main>
    );
  }

  return (
    <div className="cd-app">
      <header className="cd-header">
        <div>
          <p className="cd-eyebrow">Private collection</p>
          <h1>CDinja<span>.</span></h1>
        </div>
        <button className="cd-logout" type="button" onClick={logOut}>Lock</button>
      </header>

      <main className="cd-main">
        <section className="cd-summary" aria-label="Collection summary">
          <div><strong>{cds.length}</strong><span>Total</span></div>
          <div><strong>{ownedCount}</strong><span>On shelf</span></div>
          <div><strong>{cds.length - ownedCount}</strong><span>Wanted</span></div>
          <button type="button" onClick={() => setShowAdd((shown) => !shown)}>
            {showAdd ? "Close" : "+ Add CD"}
          </button>
        </section>

        {showAdd && (
          <form className="cd-form cd-add-form" onSubmit={createCd}>
            <div className="cd-form__heading"><h2>Add a CD</h2><span>New entry</span></div>
            <label>Album name<input value={newCd.name} onChange={(event) => setNewCd({ ...newCd, name: event.target.value })} required maxLength={300} /></label>
            <label>Artist<input value={newCd.artist} onChange={(event) => setNewCd({ ...newCd, artist: event.target.value })} required maxLength={300} /></label>
            <label className="cd-check"><input type="checkbox" checked={newCd.have} onChange={(event) => setNewCd({ ...newCd, have: event.target.checked })} /><span>I have this CD</span></label>
            <button type="submit" disabled={busyId === "add"}>{busyId === "add" ? "Adding…" : "Add to collection"}</button>
          </form>
        )}

        {error && <p className="cd-error cd-error--bar" role="alert">{error}<button type="button" onClick={() => setError("")}>Dismiss</button></p>}

        <section className="cd-controls" aria-label="Find and filter CDs">
          <label className="cd-search"><span className="cd-sr-only">Search CDs</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search artist or album…" /></label>
          <div className="cd-filters" role="group" aria-label="Ownership filter">
            {(["all", "have", "wanted"] as Filter[]).map((value) => (
              <button key={value} type="button" className={filter === value ? "active" : ""} onClick={() => setFilter(value)}>{value === "have" ? "On shelf" : value}</button>
            ))}
          </div>
        </section>

        <p className="cd-results"><span>{String(visibleCds.length).padStart(2, "0")}</span> records shown</p>
        <section className="cd-grid" aria-label="CD collection">
          {visibleCds.map((cd, index) => (
            <article className={`cd-card ${cd.have ? "cd-card--owned" : ""}`} key={cd.id}>
              {editing?.id === cd.id ? (
                <form className="cd-form cd-edit-form" onSubmit={(event) => { event.preventDefault(); void saveCd(editing); }}>
                  <label>Album name<input value={editing.name} onChange={(event) => setEditing({ ...editing, name: event.target.value })} required maxLength={300} /></label>
                  <label>Artist<input value={editing.artist} onChange={(event) => setEditing({ ...editing, artist: event.target.value })} required maxLength={300} /></label>
                  <label className="cd-check"><input type="checkbox" checked={editing.have} onChange={(event) => setEditing({ ...editing, have: event.target.checked })} /><span>I have this CD</span></label>
                  <div className="cd-form__actions"><button type="button" onClick={() => setEditing(null)}>Cancel</button><button type="submit" disabled={busyId === cd.id}>Save</button></div>
                </form>
              ) : (
                <>
                  <div className="cd-card__index">{String(index + 1).padStart(2, "0")}</div>
                  <div className="cd-card__copy"><h2>{cd.name}</h2><p>{cd.artist}</p></div>
                  <button
                    className={`cd-status ${cd.have ? "cd-status--owned" : ""}`}
                    type="button"
                    disabled={busyId === cd.id}
                    onClick={() => void saveCd({ ...cd, have: !cd.have })}
                    aria-label={`Mark ${cd.name} as ${cd.have ? "wanted" : "owned"}`}
                  >
                    <i aria-hidden="true" />{cd.have ? "On shelf" : "Wanted"}
                  </button>
                  <div className="cd-card__actions">
                    <button type="button" onClick={() => setEditing(cd)}>Edit</button>
                    <button type="button" onClick={() => void removeCd(cd)} disabled={busyId === cd.id}>Remove</button>
                  </div>
                </>
              )}
            </article>
          ))}
        </section>
        {visibleCds.length === 0 && <p className="cd-empty">No CDs match this view.</p>}
      </main>
    </div>
  );
}
