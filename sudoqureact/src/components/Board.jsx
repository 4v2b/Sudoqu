import { Square } from './Square'

export function Board({ squares, visibleSquares, mismatchedSquares, selectedSquare, onSelect, triggerMismatch }) {

    return (
        <div className="board">
            {[...squares].map(([key, value]) =>
                <Square
                    key={key}
                    name={key}
                    value={value.presetValue}
                    actualValue={value.actualValue}
                    isMismatched={mismatchedSquares.some(v => v == key) && triggerMismatch}
                    isStatic={visibleSquares.some(v => v == key)}
                    onSelect={(square) => onSelect(square)}
                    isSelected={(key == selectedSquare)}
                />
            )}
        </div>
    );
}