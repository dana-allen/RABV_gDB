import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./RabvTree.css";
import { mountRabvTree } from "./rabvTree";
import {
    buildCladeOptions,
    buildAccessionIndex,
    suggestAccessions
} from "./treeSearch";

/**
 * Reusable phylogenetic tree.
 *
 * Pass a compatible tree dataset through `data`. The component owns all
 * controls and presentation; the controller owns SVG-tree interactions.
 */
export default function RabvTree({
    data,
    className = "",
    title,
    onAccessionSelect,
    onCladeSelect
}) {
    const treeRef = useRef(null);
    const controllerRef = useRef(null);
    const callbacksRef = useRef({ onAccessionSelect, onCladeSelect });

    const [clade, setClade] = useState("");
    const [accession, setAccession] = useState("");
    const [accessionQuery, setAccessionQuery] = useState("");
    const [zoom, setZoom] = useState(1);
    const [rowSpacing, setRowSpacing] = useState(15);
    const [card, setCard] = useState(null);
    const [cladeMessage, setCladeMessage] = useState({ text: "", error: false });
    const [accessionMessage, setAccessionMessage] = useState({ text: "", error: false });

    callbacksRef.current = { onAccessionSelect, onCladeSelect };

    const cladeOptions = useMemo(
        () => data ? buildCladeOptions(data) : [],
        [data]
    );

    const accessionIndex = useMemo(
        () => data ? buildAccessionIndex(data) : null,
        [data]
    );

    const accessionSuggestions = useMemo(
        () => data && accessionIndex
            ? suggestAccessions(accessionQuery, accessionIndex, data)
            : [],
        [data, accessionIndex, accessionQuery]
    );

    const handleMessage = useCallback((type, text, error = false) => {
        const message = { text, error };
        if (type === "clade") setCladeMessage(message);
        if (type === "accession") setAccessionMessage(message);
    }, []);

    useEffect(() => {
        if (!treeRef.current || !data) return undefined;

        const controller = mountRabvTree(treeRef.current, data, {
            zoom,
            rowSpacing,
            onCardChange: setCard,
            onMessage: handleMessage
        });

        controllerRef.current = controller;

        return () => {
            controller.destroy();
            controllerRef.current = null;
        };
        // Initial zoom/row values are passed on mount; subsequent changes use
        // the controller methods below to avoid rebuilding the tree.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, handleMessage]);

    const handleCladeChange = value => {
        setClade(value);
        if (!value) {
            setCladeMessage({ text: "", error: false });
            return;
        }
        controllerRef.current?.selectClade(value);
        callbacksRef.current.onCladeSelect?.(value);
    };

    const handleAccessionSubmit = value => {
        const normalized = value.trim().toUpperCase();
        if (!normalized) return;

        setAccession(normalized);
        controllerRef.current?.selectAccession(normalized);
        callbacksRef.current.onAccessionSelect?.(normalized);
    };

    const handleClear = () => {
        setClade("");
        setAccession("");
        setAccessionQuery("");
        setCard(null);
        setCladeMessage({ text: "", error: false });
        setAccessionMessage({ text: "", error: false });
        controllerRef.current?.clear();
    };

    const handleZoom = value => {
        setZoom(value);
        controllerRef.current?.setZoom(value);
    };

    const handleRowSpacing = value => {
        setRowSpacing(value);
        controllerRef.current?.setRowSpacing(value);
    };

    if (!data) {
        return <div className={`rabv-tree ${className}`.trim()}>No tree dataset supplied.</div>;
    }

    const sequenceCount = data.nodes?.[0]?.nt ?? 0;
    const realSubcladeCount = (data.subclades || []).filter((subclade, index) => {
        const sameNameAsMajor = subclade.major >= 0 &&
            data.majors?.[subclade.major]?.name === subclade.name;
        return !sameNameAsMajor;
    }).length;

    return (
        <div className={`rabv-tree ${className}`.trim()}>
            {/* {data.banner && <div className="banner">{data.banner}</div>} */}

            <header>
                {/* <h1>{title || data.title}</h1> */}

                {/* <div className="stats">
                    {sequenceCount.toLocaleString()} sequences
                    {" · "}
                    {data.majors?.length || 0} major clades
                    {" · "}
                    {realSubcladeCount} minor clades
                    {data.nLineages != null &&
                        ` · ${data.nLineages.toLocaleString()} with a MADDOG-V2 lineage`}
                </div> */}

                <div className="finders">
                    <label className="finder">
                        <span>Find sub-clade</span>
                        <select
                            value={clade}
                            onChange={event => handleCladeChange(event.target.value)}
                        >
                            <option value="">Select a clade...</option>
                            {cladeOptions.map(option => (
                                <option
                                    key={`${option.major ?? "sub"}-${option.sub ?? ""}-${option.value}`}
                                    value={option.value}
                                >
                                    {option.value} — {option.label}
                                </option>
                            ))}
                        </select>
                        {cladeMessage.text && (
                            <span className={`msg${cladeMessage.error ? " err" : ""}`}>
                                {cladeMessage.text}
                            </span>
                        )}
                    </label>

                    <label className="finder">
                        <span>Find accession</span>
                        <input
                            type="search"
                            list="rabv-accession-suggestions"
                            value={accessionQuery}
                            placeholder="e.g. AB041966"
                            onChange={event => setAccessionQuery(event.target.value)}
                            onKeyDown={event => {
                                if (event.key === "Enter") {
                                    event.preventDefault();
                                    handleAccessionSubmit(accessionQuery);
                                }
                            }}
                            onBlur={() => {
                                if (accessionQuery.trim()) {
                                    const exact = accessionIndex &&
                                        (accessionIndex.exact.has(accessionQuery.trim().toUpperCase()) ||
                                         accessionIndex.base.has(accessionQuery.trim().toUpperCase()));
                                    if (exact) handleAccessionSubmit(accessionQuery);
                                }
                            }}
                        />
                        <datalist id="rabv-accession-suggestions">
                            {accessionSuggestions.map(value => (
                                <option key={value} value={value} />
                            ))}
                        </datalist>
                        {accessionMessage.text && (
                            <span className={`msg${accessionMessage.error ? " err" : ""}`}>
                                {accessionMessage.text}
                            </span>
                        )}
                    </label>

                    <button type="button" onClick={handleClear}>
                        Clear highlight
                    </button>
                </div>

                <div className="controls">
                    <button type="button" onClick={() => controllerRef.current?.viewSub()}>
                        Collapse to sub-clades
                    </button>
                    <button type="button" onClick={() => controllerRef.current?.viewMajor()}>
                        Collapse to major clades
                    </button>
                    <button type="button" onClick={() => controllerRef.current?.expandAll()}>
                        Expand all
                    </button>

                    <label>
                        Width
                        <input
                            type="range"
                            min="1"
                            max="6"
                            step="0.25"
                            value={zoom}
                            onChange={event => handleZoom(Number(event.target.value))}
                        />
                    </label>

                    <label>
                        Rows
                        <input
                            type="range"
                            min="8"
                            max="26"
                            step="1"
                            value={rowSpacing}
                            onChange={event => handleRowSpacing(Number(event.target.value))}
                        />
                    </label>

                    <button type="button" onClick={() => controllerRef.current?.download()}>
                        Download SVG
                    </button>
                </div>

                {card && (
                    <section className="tree-card" aria-label="Selected sequence details">
                        <button
                            className="close"
                            type="button"
                            aria-label="Close details"
                            onClick={() => {
                                setCard(null);
                                setAccession("");
                                controllerRef.current?.clear();
                            }}
                        >
                            ×
                        </button>
                        <div className="grid">
                            {card.fields.map(([label, value]) => (
                                <div key={label}>
                                    <div className="k">{label}</div>
                                    <div
                                        className="v"
                                        style={label === "Major clade"
                                            ? { color: card.majorColor }
                                            : undefined}
                                    >
                                        {value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <details className="legend" open>
                    <summary>Major clades (n sequences) — click to find</summary>
                    <div className="legend-items">
                        {data.majors.map((major, index) => (
                            <button
                                className="legend-item"
                                type="button"
                                key={`${major.name}-${index}`}
                                onClick={() => {
                                    setClade(`${major.name} (major clade)`);
                                    controllerRef.current?.selectClade(`${major.name} (major clade)`);
                                    callbacksRef.current.onCladeSelect?.(major.name);
                                }}
                            >
                                <svg width="22" height="12" aria-hidden="true">
                                    <line
                                        x1="1"
                                        y1="6"
                                        x2="21"
                                        y2="6"
                                        stroke={major.color}
                                        strokeWidth="3"
                                    />
                                </svg>
                                {major.name} ({major.n.toLocaleString()})
                            </button>
                        ))}
                    </div>
                </details>

                <div className="hint">
                    Click a triangle to expand it (sub-clade → lineage groups → sequences);
                    click a branch point to collapse it.
                    {data.purity != null &&
                        ` A group is named when at least ${Math.round(data.purity * 100)}% of its sequences share the name.`}
                </div>
            </header>

            <div ref={treeRef} className="tree-renderer" />
        </div>
    );
}
