"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  BookOpenCheck,
  CheckCircle2,
  CircleDot,
  Clock3,
  Code2,
  Eye,
  KeyRound,
  Plus,
  Radio,
  RefreshCcw,
  Save,
  Search,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { Brand } from "@/components/brand";
import { CircularProgress } from "@/components/circular-progress";
import { LearningSticker } from "@/components/learning-sticker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { TeacherSessionControls } from "@/features/auth/session-controls";
import { curriculumModules, getLessonById } from "@/features/curriculum/get-lesson";
import { CodeEditor } from "@/features/lesson-runner/components/code-editor";
import { normalizeStudentUsername } from "@/features/auth/student-identity";
import {
  createStudent,
  deleteStudent,
  listStudents,
  resetStudentProgress,
  updateStudent,
} from "./teacher-api";
import type { StudentRecord } from "./types";
import { useLiveSessions } from "./use-live-sessions";
import { useStudentProgress } from "./use-student-progress";

const lessonCount = curriculumModules.flatMap((module) => module.weeks).flatMap((week) => week.lessons).length;
const stageLabels: Record<string, string> = { practice: "Practice", challenge: "Challenge", mini: "Mini Build" };

type CreateForm = { name: string; username: string; password: string };
type EditForm = { name: string; username: string; password: string; active: boolean };

function formatAgo(timestamp: number | null, now: number) {
  if (!timestamp) return "henüz hareket yok";
  const seconds = Math.max(0, Math.floor((now - timestamp) / 1000));
  if (seconds < 10) return "şimdi";
  if (seconds < 60) return `${seconds} sn önce`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} dk önce`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} sa önce`;
  return `${Math.floor(hours / 24)} gün önce`;
}

function isOnline(timestamp: number | null, now: number) {
  return Boolean(timestamp && now - timestamp < 45_000);
}

export function TeacherDashboard() {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [selectedUid, setSelectedUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [now, setNow] = useState(() => Date.now());
  const [query, setQuery] = useState("");
  const [createForm, setCreateForm] = useState<CreateForm>({ name: "", username: "", password: "" });
  const [editForm, setEditForm] = useState<EditForm>({ name: "", username: "", password: "", active: true });
  const [showCreate, setShowCreate] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { sessions: liveSessions, error: liveError } = useLiveSessions();
  const selected = students.find((student) => student.id === selectedUid) ?? null;
  const liveSession = selectedUid ? liveSessions[selectedUid] ?? null : null;
  const { items: progressItems, error: progressError } = useStudentProgress(selectedUid);
  const completedLessons = progressItems.filter((item) => item.completed).length;

  const refresh = useCallback(async () => {
    setError("");
    try {
      const result = await listStudents();
      setStudents(result.students);
      setSelectedUid((current) => current && result.students.some((student) => student.id === current) ? current : result.students[0]?.id ?? null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Öğrenciler yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => setNow(Date.now()), 10_000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  useEffect(() => {
    if (!selected) return;
    setEditForm({ name: selected.name, username: selected.username, password: "", active: selected.active });
    setConfirmDelete(false);
    setMessage("");
    setError("");
  }, [selected]);

  const onlineCount = students.filter((student) => isOnline(liveSessions[student.id]?.updatedAtMs ?? null, now)).length;
  const activeCount = students.filter((student) => student.active).length;
  const selectedOnline = isOnline(liveSession?.updatedAtMs ?? null, now);
  const currentLessonTitle = liveSession?.lessonId ? getLessonById(liveSession.lessonId)?.title ?? liveSession.lessonId : "Henüz bir ders açık değil";
  const selectedProgressPercent = lessonCount ? Math.round((completedLessons / lessonCount) * 100) : 0;

  const visibleStudents = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("tr");
    return [...students]
      .filter((student) => !normalized || `${student.name} ${student.username}`.toLocaleLowerCase("tr").includes(normalized))
      .sort((a, b) => {
        const onlineA = Number(isOnline(liveSessions[a.id]?.updatedAtMs ?? null, now));
        const onlineB = Number(isOnline(liveSessions[b.id]?.updatedAtMs ?? null, now));
        return onlineB - onlineA || a.name.localeCompare(b.name, "tr");
      });
  }, [liveSessions, now, query, students]);

  const submitCreate = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true); setError(""); setMessage("");
    try {
      const result = await createStudent({ name: createForm.name, username: normalizeStudentUsername(createForm.username), password: createForm.password });
      setCreateForm({ name: "", username: "", password: "" });
      setShowCreate(false);
      await refresh();
      setSelectedUid(result.student.id);
      setMessage("Öğrenci hesabı oluşturuldu.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Öğrenci oluşturulamadı.");
    } finally { setBusy(false); }
  };

  const saveStudent = async () => {
    if (!selected) return;
    setBusy(true); setError(""); setMessage("");
    try {
      await updateStudent(selected.id, {
        name: editForm.name,
        username: normalizeStudentUsername(editForm.username),
        active: editForm.active,
        ...(editForm.password ? { password: editForm.password } : {}),
      });
      setEditForm((current) => ({ ...current, password: "" }));
      await refresh();
      setMessage("Öğrenci bilgileri güncellendi.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Öğrenci güncellenemedi.");
    } finally { setBusy(false); }
  };

  const resetProgress = async () => {
    if (!selected) return;
    setBusy(true); setError(""); setMessage("");
    try { await resetStudentProgress(selected.id); setMessage("Öğrencinin ilerlemesi sıfırlandı."); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "İlerleme sıfırlanamadı."); }
    finally { setBusy(false); }
  };

  const removeStudent = async () => {
    if (!selected) return;
    setBusy(true); setError(""); setMessage("");
    try {
      await deleteStudent(selected.id);
      setSelectedUid(null);
      await refresh();
      setMessage("Öğrenci silindi.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Öğrenci silinemedi."); }
    finally { setBusy(false); }
  };

  const summaryCards = [
    { label: "Toplam öğrenci", value: students.length, icon: Users, tone: "violet" as const },
    { label: "Şu an canlı", value: onlineCount, icon: Radio, tone: "mint" as const },
    { label: "Aktif hesap", value: activeCount, icon: UserCheck, tone: "sky" as const },
    { label: "Basic HTML dersi", value: lessonCount, icon: BookOpenCheck, tone: "peach" as const },
  ];

  return (
    <main className="teacher-dashboard-page" data-dashboard="teacher">
      <header className="teacher-shell-header">
        <div className="teacher-brand-group"><Brand /><span className="teacher-console-pill"><ShieldCheck /> Teacher Console</span></div>
        <TeacherSessionControls />
      </header>

      <div className="teacher-dashboard-shell">
        <section className="teacher-dashboard-hero">
          <div>
            <span className="surface-kicker">CANLI SINIF KONTROL MERKEZİ</span>
            <h1>Öğrencinin kodunu, yazarken gör.</h1>
            <p>Hesapları tek panelden yönet; hangi görevde olduklarını, test sonuçlarını ve editördeki son kodu gerçek zamanlı izle.</p>
          </div>
          <Button size="lg" onClick={() => setShowCreate((value) => !value)}>
            {showCreate ? <RefreshCcw /> : <UserPlus />}{showCreate ? "Formu kapat" : "Öğrenci ekle"}
          </Button>
        </section>

        <section className="teacher-summary-grid" aria-label="Sınıf özeti">
          {summaryCards.map(({ label, value, icon, tone }) => (
            <article className={`teacher-summary-card teacher-summary-${tone}`} key={label}>
              <LearningSticker icon={icon} label={label} tone={tone} size="md" />
              <div><strong>{value}</strong><span>{label}</span></div>
            </article>
          ))}
        </section>

        {showCreate ? (
          <section className="teacher-create-panel">
            <div className="teacher-panel-heading"><LearningSticker icon={Plus} label="Yeni öğrenci" tone="violet" /><div><span className="surface-kicker">YENİ HESAP</span><h2>Öğrenci oluştur</h2><p>Kullanıcı adı ve şifreyi sen belirlersin; öğrenci kayıt ekranı görmez.</p></div></div>
            <form onSubmit={submitCreate} className="teacher-create-form">
              <div><Label htmlFor="create-name">Adı</Label><Input id="create-name" value={createForm.name} onChange={(event) => setCreateForm((value) => ({ ...value, name: event.target.value }))} placeholder="Ege Yılmaz" required /></div>
              <div><Label htmlFor="create-username">Kullanıcı adı</Label><Input id="create-username" autoCapitalize="none" value={createForm.username} onChange={(event) => setCreateForm((value) => ({ ...value, username: event.target.value }))} onBlur={() => setCreateForm((value) => ({ ...value, username: normalizeStudentUsername(value.username) }))} placeholder="ege_01" required /></div>
              <div><Label htmlFor="create-password">Şifre</Label><Input id="create-password" type="password" minLength={6} value={createForm.password} onChange={(event) => setCreateForm((value) => ({ ...value, password: event.target.value }))} placeholder="En az 6 karakter" required /></div>
              <Button type="submit" disabled={busy}><UserPlus /> Hesabı oluştur</Button>
            </form>
          </section>
        ) : null}

        <div className="teacher-feedback-stack" aria-live="polite">
          {error ? <p className="teacher-feedback is-error" role="alert">{error}</p> : null}
          {liveError ? <p className="teacher-feedback is-error" role="alert">{liveError}</p> : null}
          {progressError ? <p className="teacher-feedback is-error" role="alert">{progressError}</p> : null}
          {message ? <p className="teacher-feedback is-success"><CheckCircle2 /> {message}</p> : null}
        </div>

        <section className="teacher-live-classroom" data-section="live-classroom">
          <aside className="teacher-roster-panel">
            <div className="teacher-roster-heading">
              <div><span className="surface-kicker">ÖĞRENCİLER</span><h2>{loading ? "Yükleniyor…" : `${students.length} hesap`}</h2></div>
              <Button variant="ghost" size="icon" aria-label="Öğrenci listesini yenile" onClick={() => void refresh()}><RefreshCcw /></Button>
            </div>
            <label className="teacher-search"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="İsim veya kullanıcı adı ara" /></label>
            <div className="teacher-roster-list">
              {!loading && visibleStudents.length === 0 ? <div className="teacher-empty-state"><Users /><strong>Sonuç bulunamadı.</strong><p>Aramayı temizle veya yeni bir öğrenci ekle.</p></div> : null}
              {visibleStudents.map((student) => {
                const session = liveSessions[student.id];
                const online = isOnline(session?.updatedAtMs ?? null, now);
                const lessonTitle = session?.lessonId ? getLessonById(session.lessonId)?.title : null;
                return (
                  <button key={student.id} type="button" onClick={() => setSelectedUid(student.id)} className={selectedUid === student.id ? "teacher-roster-item is-selected" : "teacher-roster-item"}>
                    <span className="teacher-student-avatar">{student.name.slice(0, 1).toLocaleUpperCase("tr")}</span>
                    <span className="teacher-roster-copy"><strong>{student.name}</strong><small>{lessonTitle || `@${student.username}`}</small></span>
                    <span className={online ? "teacher-presence is-online" : "teacher-presence"}><i />{online ? "Canlı" : "Offline"}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="teacher-student-command">
            {selected ? (
              <>
                <section className="teacher-live-code-card">
                  <div className="teacher-live-code-header">
                    <div className="teacher-live-student">
                      <span className="teacher-selected-avatar">{selected.name.slice(0, 1).toLocaleUpperCase("tr")}</span>
                      <div><span className="surface-kicker">SEÇİLİ ÖĞRENCİ</span><h2>{selected.name}</h2><p>@{selected.username}</p></div>
                    </div>
                    <div className="teacher-live-statuses">
                      <Badge variant={selectedOnline ? "success" : "outline"}><CircleDot /> {selectedOnline ? "CANLI" : "ÇEVRİMDIŞI"}</Badge>
                      <span><Clock3 /> {formatAgo(liveSession?.updatedAtMs ?? null, now)}</span>
                    </div>
                  </div>

                  <div className="teacher-live-context">
                    <div><Code2 /><span><small>AKTİF DERS</small><strong>{currentLessonTitle}</strong></span></div>
                    <div><Activity /><span><small>SON AKSİYON</small><strong>{liveSession?.lastAction || "Bekleniyor"}</strong></span></div>
                    <div><Eye /><span><small>AŞAMA</small><strong>{liveSession?.taskId ? stageLabels[liveSession.taskId] ?? liveSession.taskId : "—"}</strong></span></div>
                    <div className="teacher-live-score"><span><small>TESTLER</small><strong>{liveSession ? `${liveSession.passedCount}/${liveSession.totalTests}` : "—"}</strong></span></div>
                  </div>

                  <div className="teacher-live-editor-header"><span><Eye /> Canlı kod · yalnızca görüntüleme</span><small>Öğrenci yazdıkça yaklaşık 750 ms içinde güncellenir.</small></div>
                  <div className="teacher-live-editor">
                    <CodeEditor value={liveSession?.code ?? "<!-- Öğrenci ders editörünü açtığında kod burada canlı görünecek. -->"} readOnly minHeight="500px" ariaLabel={`${selected.name} canlı kodu`} />
                  </div>
                </section>

                <div className="teacher-detail-grid">
                  <section className="teacher-detail-card teacher-progress-card">
                    <div className="teacher-panel-heading compact"><LearningSticker icon={BookOpenCheck} label="İlerleme" tone="sky" /><div><span className="surface-kicker">ÖĞRENME İLERLEMESİ</span><h3>Basic HTML</h3></div></div>
                    <div className="teacher-progress-overview">
                      <CircularProgress value={selectedProgressPercent} size={88} strokeWidth={8} tone="sky"><span><strong>{selectedProgressPercent}%</strong><small>tamam</small></span></CircularProgress>
                      <div><strong>{completedLessons}/{lessonCount} ders</strong><p>Özgün companion görevleri</p><Progress value={selectedProgressPercent} /></div>
                    </div>
                    <div className="teacher-recent-progress">
                      <span className="surface-kicker">SON ÇALIŞMALAR</span>
                      {[...progressItems].sort((a, b) => (b.updatedAtMs ?? 0) - (a.updatedAtMs ?? 0)).slice(0, 5).map((item) => (
                        <div key={item.lessonId}><span><strong>{getLessonById(item.lessonId)?.title ?? item.lessonId}</strong><small>{formatAgo(item.updatedAtMs, now)}</small></span><Badge variant={item.completed ? "success" : "outline"}>{item.completed ? "Tamam" : `${item.lastPassedCount}/${item.totalTests}`}</Badge></div>
                      ))}
                      {progressItems.length === 0 ? <p className="teacher-muted-copy">Henüz kayıtlı ders ilerlemesi yok.</p> : null}
                    </div>
                    <Button variant="outline" onClick={() => void resetProgress()} disabled={busy}><RefreshCcw /> İlerlemeyi sıfırla</Button>
                  </section>

                  <section className="teacher-detail-card teacher-account-card">
                    <div className="teacher-panel-heading compact"><LearningSticker icon={KeyRound} label="Hesap yönetimi" tone="peach" /><div><span className="surface-kicker">HESAP YÖNETİMİ</span><h3>Giriş bilgileri</h3></div></div>
                    <div><Label htmlFor="edit-name">Adı</Label><Input id="edit-name" value={editForm.name} onChange={(event) => setEditForm((value) => ({ ...value, name: event.target.value }))} /></div>
                    <div><Label htmlFor="edit-username">Kullanıcı adı</Label><Input id="edit-username" value={editForm.username} onChange={(event) => setEditForm((value) => ({ ...value, username: event.target.value }))} /></div>
                    <div><Label htmlFor="edit-password">Yeni şifre <small>(boşsa değişmez)</small></Label><Input id="edit-password" type="password" minLength={6} value={editForm.password} onChange={(event) => setEditForm((value) => ({ ...value, password: event.target.value }))} placeholder="Yeni şifre" /></div>
                    <label className="teacher-active-toggle"><input type="checkbox" checked={editForm.active} onChange={(event) => setEditForm((value) => ({ ...value, active: event.target.checked }))} /><span><strong>Hesap aktif</strong><small>Kapalıyken öğrenci giriş yapamaz.</small></span></label>
                    <Button onClick={() => void saveStudent()} disabled={busy}><Save /> Değişiklikleri kaydet</Button>
                    <div className="teacher-danger-zone">
                      {!confirmDelete ? <Button variant="ghost" onClick={() => setConfirmDelete(true)}><Trash2 /> Öğrenciyi sil</Button> : (
                        <div><p><strong>{selected.name}</strong> hesabı ve tüm ilerlemesi kalıcı olarak silinecek.</p><div><Button variant="outline" onClick={() => setConfirmDelete(false)}>Vazgeç</Button><Button className="danger-solid" onClick={() => void removeStudent()} disabled={busy}><Trash2 /> Kalıcı sil</Button></div></div>
                      )}
                    </div>
                  </section>
                </div>
              </>
            ) : <div className="teacher-empty-state teacher-command-empty"><Users /><strong>Bir öğrenci seç.</strong><p>Canlı kod, testler ve hesap bilgileri burada görünecek.</p></div>}
          </div>
        </section>
      </div>
    </main>
  );
}
