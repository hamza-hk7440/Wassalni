import React, { useCallback, useEffect, useMemo, useState } from "react";
import Navbar from "../layout/NavbarRa";
import {
  getAllUsers,
  deleteUser,
  createController,
  updateUser,
} from "../../api/admin";
import { useAdminLanguage } from "./language.jsx";

const EMPTY_FORM = {
  first_name: "",
  second_name: "",
  email: "",
  password: "",
};

function EmployeeManagementPage({
  pageTitle = "Gestion des employes",
  pageSubtitle = "Creer et gerer les comptes.",
  role = "employee",
}) {
  const { t } = useAdminLanguage();
  const [employees, setEmployees] = useState([]);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creationInfo, setCreationInfo] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Fetch employees from the backend filtered by role
  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllUsers();
      const users = Array.isArray(data) ? data : data.users || [];
      // Filter by role (admin or controller)
      const filtered = users.filter((u) => u.role === role);
      setEmployees(
        filtered.map((u) => ({
          id: String(u.user_id),
          first_name: u.first_name || "",
          second_name: u.last_name || "",
          nom: `${u.first_name || ""} ${u.last_name || ""}`.trim() || "Inconnu",
          email: u.email || "",
          role: u.role,
        })),
      );
    } catch (err) {
      console.error("Failed to load employees", err);
      setError(
        t("loadEmployeesError", "Unable to load list. Please try again."),
      );
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const filteredEmployees = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text) {
      return employees;
    }

    return employees.filter((employee) => {
      return (
        employee.id.toLowerCase().includes(text) ||
        employee.nom.toLowerCase().includes(text) ||
        employee.email.toLowerCase().includes(text)
      );
    });
  }, [employees, query]);

  const startCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
    setCreationInfo(null);
  };

  const startEdit = (employee) => {
    setEditingId(employee.id);
    setForm({
      first_name: employee.first_name || "",
      second_name: employee.second_name || "",
      email: employee.email,
      password: "", // Leave empty unless they want to change it
    });
    setError("");
    setCreationInfo(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const normalized = {
      first_name: form.first_name.trim(),
      second_name: form.second_name.trim(),
      email: form.email.trim(),
      password: form.password.trim(),
    };

    if (
      !normalized.first_name ||
      !normalized.second_name ||
      !normalized.email ||
      (!normalized.password && !editingId)
    ) {
      setError(t("requiredFields", "Required fields."));
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (editingId) {
        await updateUser(editingId, {
          first_name: normalized.first_name,
          last_name: normalized.second_name,
          email: normalized.email,
          ...(normalized.password ? { password: normalized.password } : {}),
        });
      } else {
        const result = await createController({
          first_name: normalized.first_name,
          last_name: normalized.second_name,
          email: normalized.email,
          password: normalized.password,
          role,
        });

        const code =
          result?.reference_code || result?.controller?.controller_code || null;
        const details =
          result?.reference_code_details ||
          result?.controller?.reference_code_details ||
          null;

        if (code) {
          setCreationInfo({
            code,
            details,
            fullName:
              `${normalized.first_name} ${normalized.second_name}`.trim(),
            email: normalized.email,
            role,
          });
        } else {
          setCreationInfo(null);
        }
      }
      setEditingId(null);
      setForm(EMPTY_FORM);
      // Refresh the list
      await fetchEmployees();
    } catch (err) {
      console.error("Failed to save employee", err);
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        t("saveError", "Error while saving.");
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        t(
          "deleteEmployeeConfirm",
          "Do you really want to delete this employee?",
        ),
      )
    )
      return;
    try {
      setError("");
      await deleteUser(id);
      setEmployees((prev) => prev.filter((employee) => employee.id !== id));
    } catch (err) {
      console.error("Failed to delete employee", err);
      setError(t("deleteEmployeeError", "Error while deleting."));
    }
  };

  return (
    <div>
      <Navbar />
      <section className="min-h-screen px-4 pb-10 pt-24 md:px-8 bg-gradient-to-b from-iceWhite via-frostBlue via-[35%] to-pureWhite">
        <div className="mx-auto max-w-5xl">
          <header className="rounded-3xl border bg-white/95 p-6 shadow-xl md:p-8 border-frostBlue">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-skyBlue">
              {t("employeesModule", "Employees Module")}
            </p>
            <h1 className="mt-2 text-2xl font-black md:text-4xl text-deepOcean">
              {pageTitle}
            </h1>
            <p className="mt-2 text-sm text-classicBlue">{pageSubtitle}</p>
          </header>

          <div className="mt-6 rounded-3xl border bg-white p-6 shadow-lg md:p-8 border-frostBlue">
            <div className="grid gap-3 md:grid-cols-[1fr_auto]">
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t(
                  "searchByIdNameEmail",
                  "Search by ID, name or email",
                )}
                className="w-full rounded-2xl border px-4 py-3 text-sm outline-none border-frostBlue"
              />
              <button
                type="button"
                onClick={startCreate}
                className="rounded-2xl px-4 py-3 text-sm font-bold transition-all hover:opacity-90 active:scale-95 bg-deepOcean text-pureWhite"
              >
                {t("newAction", "New")}
              </button>
            </div>

            {error && (
              <div className="mt-3 rounded-xl bg-dangerSoft/20 border border-dangerSoft p-3 text-sm text-dangerText font-medium">
                {error}
              </div>
            )}

            {creationInfo?.code && (
              <div className="mt-3 rounded-xl border border-skyBlue/40 bg-skyBlue/10 p-4 text-sm text-deepOcean">
                <p className="font-black text-skyBlue">
                  {t("accountCreatedSuccess", "Account created successfully")}
                </p>
                <p className="mt-1 text-sm text-deepOcean">
                  {t(
                    "accountCreatedFor",
                    "Account {fullName} ({email}) was created with role {role}.",
                    {
                      fullName: creationInfo.fullName,
                      email: creationInfo.email,
                      role: creationInfo.role,
                    },
                  )}
                </p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-classicBlue">
                  {t("codeToEnter", "Code to enter")}
                </p>
                <p className="mt-1 font-mono text-base">{creationInfo.code}</p>
                <p className="mt-2 text-xs text-textGray">
                  {t(
                    "keepCodeInstruction",
                    "Keep this code and enter it on the second login.",
                  )}
                </p>
                {creationInfo?.details?.formula && (
                  <div className="mt-2 text-xs text-textGray space-y-1">
                    <p>
                      {t("calculationFunction", "Calculation function")}:{" "}
                      {creationInfo.details.formula}
                    </p>
                    <p>
                      {t("randomRange", "Random range")}:{" "}
                      {creationInfo.details.random_range}
                    </p>
                    <p>
                      {t("randomValue", "Random value picked")}:{" "}
                      {creationInfo.details.random_value}
                    </p>
                  </div>
                )}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-6 grid gap-4 rounded-2xl p-5 md:grid-cols-2 transition-colors border border-skyBlue bg-skyBlue/5 shadow-[0_0_15px_rgba(56,189,248,0.1)]"
            >
              <div className="md:col-span-2 mb-1">
                <h3 className="text-lg font-bold text-skyBlue">
                  {editingId
                    ? t("editEmployeeTitle", "Editing employee #{id}", {
                        id: editingId,
                      })
                    : t("createNewAccount", "Create a new account")}
                </h3>
                <p className="text-xs text-textGray mt-1">
                  {editingId
                    ? t(
                        "updateEmployeeInfo",
                        "Update the information below. Leave password empty to keep it unchanged.",
                      )
                    : t(
                        "fillFieldsToAddUser",
                        "Fill out the fields to add this user to the system.",
                      )}
                </p>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-classicBlue">
                  {t("firstName", "First name")} *
                </label>
                <input
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  placeholder={t("firstNamePlaceholder", "Ex: John")}
                  className="w-full rounded-xl border px-4 py-3 text-base font-bold outline-none border-classicBlue focus:ring-2 focus:ring-skyBlue/50 text-deepOcean shadow-sm transition-all"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-classicBlue">
                  {t("secondName", "Last name")} *
                </label>
                <input
                  name="second_name"
                  value={form.second_name}
                  onChange={handleChange}
                  placeholder={t("lastNamePlaceholder", "Ex: Doe")}
                  className="w-full rounded-xl border px-4 py-3 text-base font-bold outline-none border-classicBlue focus:ring-2 focus:ring-skyBlue/50 text-deepOcean shadow-sm transition-all"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-textGray">
                  Email *
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder={t("emailPlaceholder", "email@example.com")}
                  className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none border-frostBlue text-deepOcean"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-textGray">
                  {t("password", "Password")}{" "}
                  {editingId ? t("passwordOptional", "(optional)") : "*"}
                </label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder={
                    editingId
                      ? t("newPasswordPlaceholder", "New password")
                      : t("passwordPlaceholder", "Password")
                  }
                  className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none border-frostBlue text-deepOcean"
                />
              </div>

              <div className="flex gap-2 w-full md:col-span-2 mt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl px-4 py-2.5 text-sm font-bold transition-all hover:opacity-90 active:scale-95 bg-classicBlue text-pureWhite disabled:opacity-50 shadow-md"
                >
                  {saving
                    ? t("saving", "Saving...")
                    : editingId
                      ? t("saveChanges", "Save changes")
                      : t("add", "Add")}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={startCreate}
                    disabled={saving}
                    className="flex-1 rounded-xl px-4 py-2.5 text-sm font-bold transition-all hover:bg-dangerSoft/20 active:scale-95 border border-dangerSoft text-dangerText disabled:opacity-50"
                  >
                    {t("cancelEditLong", "Cancel editing")}
                  </button>
                )}
              </div>
            </form>

            <div className="mt-4 rounded-2xl border px-4 py-3 text-sm font-bold border-frostBlue text-deepOcean bg-iceWhite">
              {loading
                ? t("loading", "Loading...")
                : `${filteredEmployees.length} ${t("itemsCountEmployees", "employee(s)")}`}
            </div>

            <div className="mt-5 grid gap-4">
              {loading ? (
                <div className="rounded-2xl border border-dashed p-6 text-center text-sm border-frostBlue text-textGray bg-iceWhite">
                  {t("loadingData", "Loading data...")}
                </div>
              ) : filteredEmployees.length === 0 ? (
                <div className="rounded-2xl border border-dashed p-6 text-center text-sm border-frostBlue text-textGray bg-iceWhite">
                  {t("emptyEmployees", "No employees found.")}
                </div>
              ) : (
                filteredEmployees.map((employee) => (
                  <div
                    key={employee.id}
                    className="rounded-2xl border p-5 shadow-sm border-frostBlue bg-pureWhite"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-skyBlue mb-1">
                          {role} — ID: #{employee.id}
                        </p>
                        <h2 className="text-xl md:text-2xl font-black text-deepOcean">
                          {employee.nom}
                        </h2>
                        <div className="mt-2 flex items-center gap-2 text-sm text-textGray">
                          <svg
                            className="h-4 w-4 text-classicBlue"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="font-medium">{employee.email}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(employee)}
                          className="rounded-full border px-3 py-1.5 text-xs font-bold transition-colors hover:bg-skyBlue/10 active:scale-95 border-skyBlue text-skyBlue"
                        >
                          {t("edit", "Edit")}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(employee.id)}
                          className="rounded-full border px-3 py-1.5 text-xs font-bold transition-colors hover:bg-dangerSoft/20 active:scale-95 border-dangerSoft text-dangerText"
                        >
                          {t("delete", "Delete")}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default EmployeeManagementPage;
