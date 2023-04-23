"use client";
import { bewoners } from "@/models/bewoners";
import { Dispatch, SetStateAction, useState } from "react";
import { FiXCircle } from "react-icons/fi";

interface Props {
  children: React.ReactNode;
  bs: [number, string][];
}

interface BewonerGastInputProps {
  bewoners: [number, string][];
  bewonerId?: number;
  setBewonerId: Dispatch<SetStateAction<number>>;
  gast: string;
  setGast: Dispatch<SetStateAction<string>>;
  isGast: boolean;
  setIsGast: Dispatch<SetStateAction<boolean>>;
}

export const ErrorAlert = () => {
  return (
    <div className="alert  shadow-lg items-start">
      <div>
        <FiXCircle color={"white"} />
        <span>Er is iets misgegaan.</span>
      </div>
    </div>
  );
};

export const BewonerGastInput = ({
  bewoners,
  bewonerId,
  setBewonerId,
  gast,
  setGast,
  isGast,
  setIsGast,
}: BewonerGastInputProps) => {
  return (
    <>
      <label className="input-group flex ">
        {isGast ? (
          <input
            type="text"
            placeholder="Door"
            className="input input-bordered  w-full"
            onChange={(e) => setGast(e.target.value)}
            value={gast}
          />
        ) : (
          <select
            className={`select select-bordered grow ${
              !bewonerId ? "text-opacity-10" : ""
            }`}
          >
            <option disabled selected={!bewonerId}>
              Selecteer bewoner
            </option>
            {bewoners.map(([id, b]) => {
              return (
                <option
                  key={id}
                  onClick={() => setBewonerId(id)}
                  selected={bewonerId === id}
                >
                  {b}
                </option>
              );
            })}
          </select>
        )}
        <span onClick={() => setIsGast(!isGast)}>
          Gast{" "}
          <input
            type="checkbox"
            className="checkbox checkbox-xs ml-2"
            readOnly
            checked={isGast}
          />
        </span>
      </label>
    </>
  );
};

export const UitspraakForm = ({ children, bs }: Props) => {
  const [showForm, setShowForm] = useState(false);

  const [bewonerID, setBewonerID] = useState<number>(0);
  const [tegenBewoner, setTegenBewoner] = useState<number>(0);

  const [gast, setGast] = useState("");
  const [tegenGast, setTegenGast] = useState("");

  const [isDoorGast, setIsDoorGast] = useState(false);
  const [isTegenGast, setIsTegenGast] = useState(false);

  const [uitspraak, setUitspraak] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const clearForm = () => {
    setBewonerID(0);
    setTegenBewoner(0);
    setGast("");
    setTegenGast("");
    setIsDoorGast(false);
    setIsTegenGast(false);
    setUitspraak("");
  };

  const handleCancel = () => {
    clearForm();
    setError(false);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch("/api/quotes", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bewonerID: isDoorGast ? 0 : bewonerID,
        tegenbewonerID: isTegenGast ? 0 : tegenBewoner,
        gast: isDoorGast ? gast : "",
        tegengast: isTegenGast ? tegenGast : "",
        uitspraak: uitspraak,
      }),
    });
    if (res.ok) {
      setLoading(false);
      setShowForm(false);
      clearForm();
      setTimeout(() => {
        window.location.reload();
      }, 200);
    } else {
      setError(true);
    }
  };

  return (
    <div
      className={`mt-4 transition ease-in-out delay-0 duration-250 -z-10 ${
        !showForm ? "-translate-y-80 md:-translate-y-56" : ""
      }`}
    >
      {error && <ErrorAlert />}
      <div
        className={`form-control grid grid-cols-6 md:grid-cols-12 gap-4 h-72 md:h-52`}
      >
        <div className="col-span-6">
          <label className="label">
            <span className="label-text">Door</span>
          </label>
          <BewonerGastInput
            bewoners={bs}
            bewonerId={bewonerID}
            setBewonerId={setBewonerID}
            gast={gast}
            setGast={setGast}
            isGast={isDoorGast}
            setIsGast={setIsDoorGast}
          />
        </div>
        <div className="col-span-6">
          <label className="label">
            <span className="label-text">Tegen</span>
          </label>
          <BewonerGastInput
            bewoners={bs}
            bewonerId={tegenBewoner}
            setBewonerId={setTegenBewoner}
            gast={tegenGast}
            setGast={setTegenGast}
            isGast={isTegenGast}
            setIsGast={setIsTegenGast}
          />
        </div>
        <div className="col-span-full">
          <textarea
            className="textarea textarea-bordered w-full resize-none "
            placeholder="Uitspraak"
            value={uitspraak}
            onChange={(e) => setUitspraak(e.target.value)}
          />
        </div>
      </div>
      <div className="divider mt-8">
        {!showForm ? (
          <div className="btn" onClick={() => setShowForm(true)}>
            Nieuw uitspraak
          </div>
        ) : (
          <>
            <div className="btn" onClick={() => handleCancel()}>
              Annuleren
            </div>{" "}
            <div className="btn" onClick={() => handleSubmit()}>
              Opslaan
            </div>
          </>
        )}
      </div>
      {children}
    </div>
  );
};
