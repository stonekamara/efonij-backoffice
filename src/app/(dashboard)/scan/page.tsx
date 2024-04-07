"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { createValidation } from "@/app/actions";
import { supabase } from "@/lib/supabase/browser";
import type { Candidature, Profile, ValidationType } from "@/lib/types";
import { OFFRE_TYPES } from "@/lib/types";
import { dateFr } from "@/lib/format";
import {
  Alert,
  Badge,
  Button,
  Card,
  EmptyState,
  Field,
  PageHeader,
  Select,
} from "@/components/ui";

type ScanState =
  | { step: "idle" }
  | { step: "scanning" }
  | { step: "error"; message: string }
  | { step: "profile"; profile: Profile; candidatures: Candidature[] }
  | { step: "validated"; message: string };

export default function ScanPage() {
  const [state, setState] = useState<ScanState>({ step: "idle" });
  const [selected, setSelected] = useState<string>("");
  const [type, setType] = useState<ValidationType>("presence_evenement");
  const [submitting, setSubmitting] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const orgIdRef = useRef<string | null>(null);
  const busyRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data: membership } = await supabase
        .from("organisation_users")
        .select("organisation_id")
        .single();
      if (!cancelled && membership) orgIdRef.current = membership.organisation_id;
    })();

    return () => {
      cancelled = true;
      stopScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function stopScanner() {
    const scanner = scannerRef.current;
    if (!scanner) return;
    try {
      await scanner.stop();
      scanner.clear();
    } catch {
      // déjà arrêté
    }
    scannerRef.current = null;
  }

  async function startScanning() {
    setState({ step: "scanning" });
    await stopScanner();
    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;
    try {
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        async (decoded) => {
          if (busyRef.current) return;
          busyRef.current = true;
          await stopScanner();
          await handleDecoded(decoded);
          busyRef.current = false;
        },
        () => {},
      );
    } catch {
      setState({
        step: "error",
        message:
          "Impossible d'accéder à la caméra. Autorisez l'accès caméra dans votre navigateur.",
      });
    }
  }

  async function handleDecoded(text: string) {
    const match = text.match(/^EFONIJ:([0-9a-fA-F-]{36})$/);
    if (!match) {
      setState({
        step: "error",
        message: "QR code invalide : ce n'est pas un Passeport Jeune E-FONIJ.",
      });
      return;
    }
    const profileId = match[1];

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, prenom, nom, matricule, niveau_passeport")
      .eq("id", profileId)
      .maybeSingle();

    if (!profile) {
      setState({
        step: "error",
        message: "Aucun jeune ne correspond à ce QR code.",
      });
      return;
    }

    const orgId = orgIdRef.current;
    const { data: candidatures } = orgId
      ? await supabase
          .from("candidatures")
          .select("id, offre_id, statut, offres!inner(id, titre, structure_id, type, statut)")
          .eq("user_id", profile.id)
          .eq("offres.structure_id", orgId)
          .eq("offres.statut", "ouverte")
      : { data: [] };

    const mine = (candidatures ?? []).filter((c) => {
      const offres = (c.offres ?? []) as Array<{ structure_id: string | null }>;
      return offres.some((o) => o.structure_id === orgId);
    });

    setState({
      step: "profile",
      profile: profile as Profile,
      candidatures: mine as unknown as Candidature[],
    });
    setSelected(mine[0]?.id ?? "");
  }

  async function submitValidation() {
    if (!selected || submitting) return;
    setSubmitting(true);
    const res = await createValidation({ candidatureId: selected, type });
    const errMsg = res && "error" in res ? res.error : null;
    if (errMsg) {
      setState({ step: "error", message: errMsg });
    } else {
      const s = state as Extract<ScanState, { step: "profile" }>;
      const cand = s.candidatures.find((c) => c.id === selected);
      const label =
        type === "presence_evenement"
          ? "Présence validée"
          : "Candidature confirmée";
      setState({
        step: "validated",
        message: `${label} pour ${s.profile.prenom} ${s.profile.nom}${
          cand?.offres?.[0]?.titre ? ` · ${cand.offres[0].titre}` : ""
        }.`,
      });
    }
    setSubmitting(false);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Scan QR code"
        subtitle="Scannez le QR code du Passeport Jeune pour valider une présence ou une candidature."
      />

      {state.step === "idle" && (
        <Card className="flex flex-col items-center p-10 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-fonij/10 text-4xl">
            📷
          </div>
          <h2 className="text-lg font-extrabold text-slate-900">
            Prêt à scanner ?
          </h2>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            Pointez la caméra vers le QR code du passeport d'un jeune pour
            retrouver ses candidatures sur vos offres.
          </p>
          <Button className="mt-6" onClick={startScanning}>
            Activer la caméra
          </Button>
        </Card>
      )}

      {state.step === "scanning" && (
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-bold text-slate-700">
              📷 Caméra active : visez le QR code…
            </p>
            <Button variant="secondary" onClick={() => setState({ step: "idle" })}>
              Annuler
            </Button>
          </div>
          <div id="qr-reader" className="overflow-hidden rounded-xl" />
        </Card>
      )}

      {state.step === "error" && (
        <Card className="p-6">
          <Alert kind="error">{state.message}</Alert>
          <Button className="mt-5" onClick={startScanning}>
            Scanner à nouveau
          </Button>
        </Card>
      )}

      {state.step === "validated" && (
        <Card className="p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
            ✅
          </div>
          <h2 className="text-lg font-extrabold text-slate-900">
            Validation enregistrée
          </h2>
          <p className="mt-2 text-sm text-slate-600">{state.message}</p>
          <p className="mt-1 text-xs text-slate-400">
            Le jeune verra le badge correspondant dans son app E-FONIJ.
          </p>
          <Button className="mt-6" onClick={() => setState({ step: "idle" })}>
            Scanner un autre QR code
          </Button>
        </Card>
      )}

      {state.step === "profile" && (
        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-fonij text-lg font-black text-white">
                {`${state.profile.prenom.charAt(0)}${state.profile.nom.charAt(0)}`.toUpperCase()}
              </div>
              <div>
                <p className="text-lg font-extrabold text-slate-900">
                  {state.profile.prenom} {state.profile.nom}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Badge color="fonij">
                    {state.profile.matricule ?? "Sans matricule"}
                  </Badge>
                  <Badge>Niveau {state.profile.niveau_passeport}</Badge>
                </div>
              </div>
            </div>

            {state.candidatures.length === 0 ? (
              <div className="mt-5">
                <EmptyState
                  icon="📭"
                  title="Aucune candidature sur vos offres"
                  message="Ce jeune n'a pas postulé à une offre de votre organisation."
                />
                <Button
                  variant="secondary"
                  className="mt-4"
                  onClick={() => setState({ step: "idle" })}
                >
                  Scanner un autre QR code
                </Button>
              </div>
            ) : (
              <div className="mt-5">
                <Field label="Candidature à valider *">
                  <Select
                    value={selected}
                    onChange={(e) => setSelected(e.target.value)}
                  >
                    {state.candidatures.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.offres?.[0]?.titre ?? "Offre"} ·{" "}
                        {OFFRE_TYPES[c.offres?.[0]?.type ?? "formation"]}
                      </option>
                    ))}
                  </Select>
                </Field>

                <div className="mt-4">
                  <Field label="Type de validation *">
                    <Select
                      value={type}
                      onChange={(e) => setType(e.target.value as ValidationType)}
                    >
                      <option value="presence_evenement">
                        Présence à un événement
                      </option>
                      <option value="confirmation_candidature">
                        Confirmation de candidature
                      </option>
                    </Select>
                  </Field>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Button onClick={submitValidation} disabled={submitting || !selected}>
                    {submitting ? "Enregistrement…" : "Valider"}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setState({ step: "idle" })}
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            )}
          </Card>

          <p className="text-center text-xs text-slate-400">
            La validation apparaît immédiatement dans l'app du jeune (badge sur
            la candidature). Dernière validation : {dateFr(new Date().toISOString())}
          </p>
        </div>
      )}
    </div>
  );
}
