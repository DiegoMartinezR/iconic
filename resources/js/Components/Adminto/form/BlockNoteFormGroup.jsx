import React, { useEffect, useRef } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { MantineProvider } from "@mantine/core";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/react/style.css";
import "@blocknote/mantine/style.css";
import "@mantine/core/styles.css";

/**
 * BlockNoteFormGroup
 *
 * Editor de bloques avanzado (tipo Notion) para el admin.
 * Usa el campo `content_blocks` (JSON) del modelo Service.
 *
 * Props:
 *  - label: string - etiqueta del campo
 *  - value: Array | null - bloques JSON actuales (del estado del padre)
 *  - onChange: (blocks: Array) => void - callback al cambiar
 */
const BlockNoteFormGroup = ({ label = "Contenido Avanzado (Landing)", value, onChange }) => {
    const editor = useCreateBlockNote({
        initialContent:
            Array.isArray(value) && value.length > 0 ? value : undefined,
    });

    // Sincronizar cambios hacia el padre
    useEffect(() => {
        if (!editor) return;
        const unsubscribe = editor.onChange(() => {
            onChange(editor.document);
        });
        return () => {
            if (typeof unsubscribe === "function") unsubscribe();
        };
    }, [editor, onChange]);

    // Cuando value llega del servidor (modal open) y el editor ya existe
    const prevValueRef = useRef(null);
    useEffect(() => {
        if (!editor) return;
        if (
            Array.isArray(value) &&
            value.length > 0 &&
            JSON.stringify(value) !== JSON.stringify(prevValueRef.current)
        ) {
            prevValueRef.current = value;
            editor.replaceBlocks(editor.document, value);
        } else if (!value || (Array.isArray(value) && value.length === 0)) {
            prevValueRef.current = null;
        }
    }, [value, editor]);

    return (
        <div className="mb-3">
            {label && (
                <label className="form-label fw-semibold">
                    <i className="fas fa-cubes me-1 text-primary"></i>
                    {label}
                </label>
            )}
            <div
                className="blocknote-editor-wrapper"
                style={{
                    border: "1px solid #dee2e6",
                    borderRadius: "8px",
                    minHeight: "350px",
                    backgroundColor: "#fff",
                    overflow: "visible",
                }}
            >
                {editor && (
                    <MantineProvider>
                        <BlockNoteView editor={editor} theme="light" />
                    </MantineProvider>
                )}
            </div>
            <small className="text-muted mt-1 d-block ms-1">
                <i className="fas fa-info-circle me-1"></i>
                Escribe <kbd>/</kbd> para desplegar el menú interactivo de bloques (Tablas, Listas, Citas, Imágenes, Callouts, etc.).
            </small>
        </div>
    );
};

export default BlockNoteFormGroup;


