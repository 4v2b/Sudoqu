import { useState } from "react";

export function Toolbar({ seed, onValidate, onSolution, onReturn }) {
    const [seedCopied, setSeedCopied] = useState(false)

    const handleCopyClick = async () => {
        try {
            await window.navigator.clipboard.writeText(seed);
            console.log("Seed copied")
            setSeedCopied(true)
        } catch (err) {
            console.error(
                "Unable to copy to clipboard.",
                err
            );
        }
    };

    return (
        <div className="toolbar">
            <div onClick={onValidate}>
                Check
            </div>
            <div onClick={onSolution}>
                Solve
            </div>
            <div className="seed">
                Seed: <span className="seed-copy" style={{backgroundColor: seedCopied ? "#80EF80" : "#E5E5E5" }} onClick={handleCopyClick}>{seed}</span>
            </div>
            <div onClick={onReturn}>Back to menu</div>
        </div>
    )
}