import { useState, useEffect } from 'react';
import { Board } from './Board';
import { ButtonPanel } from './ButtonPanel';
import { validate } from '../api';
import { Toolbar } from './Toolbar';

export function Puzzle({ squares, visibleSquares, seed, onReturn }) {
    const [selectedSquare, setSelectedSquare] = useState(null);
    const [isReady, setIsReady] = useState(false);
    const [values, setValues] = useState(squares);
    const [mismatched, setMismatched] = useState([]);
    const [triggerMismatch, setTriggerMismatch] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setTriggerMismatch(false), 2000);
        return () => clearTimeout(timeout);
    }, [triggerMismatch])

    useEffect(() => {
        setValues((prev) => {

            const newMap = new Map(prev);

            prev.forEach((value, key) => {
                const actualValue = visibleSquares.some(el => el === key)
                    ? value.presetValue
                    : null;

                newMap.set(key, {
                    presetValue: value.presetValue,
                    actualValue: actualValue
                });
            });

            return newMap;
        });
    }, []);

    useEffect(() => {
        const isComplete = Array.from(values.values()).every(
            (square) => square.actualValue !== null
        );
        setIsReady(isComplete);
    }, [values]);

    useEffect(() => {
        if (isReady && correctSquares.length < 81) {
            handleValidation()
        }
    }, [isReady])

    function handleButtonClick(value) {
        if (selectedSquare) {
            setValues((prev) => {
                const newMap = new Map(prev);
                const square = newMap.get(selectedSquare);

                if (square) {
                    const prevValue = square.actualValue;
                    const newValue = value > 0 && value < 10 ? value : null;

                    if (prevValue === newValue) {
                        return prev;
                    }

                    newMap.set(selectedSquare, {
                        ...square,
                        actualValue: newValue
                    });
                }

                return newMap;
            });
        }
    }

    function handleSolution(){
        setValues((prev) => {

            const newMap = new Map(prev);

            prev.forEach((value, key) => {
                newMap.set(key, {
                    presetValue: value.presetValue,
                    actualValue: value.presetValue
                });
            });

            return newMap;
        });
    }

    async function handleValidation() {
        try {
            const actualValues = Object.fromEntries(new Map(
                [...values].map(([key, value]) => [key, value.actualValue || 0])
            ))
            const res = await validate(actualValues, seed)
            setMismatched(res)
            setTriggerMismatch(true)
        }
        catch (error) {
            console.error('Error:', error);
        }
    }

    const correctSquares = 
    (isReady && [...values].every(([_, value]) => value.actualValue == value.presetValue))
        ? [...values].map(([key, _]) => key)
        : visibleSquares

    return (<div className='container'>
        <Toolbar onValidate={handleValidation} seed={seed} onSolution={handleSolution} onReturn={onReturn} />
        <Board
            squares={values}
            visibleSquares={correctSquares}
            onSelect={(square) => setSelectedSquare(square)}
            selectedSquare={selectedSquare}
            mismatchedSquares={mismatched}
            triggerMismatch={triggerMismatch}
        />
        <ButtonPanel onButtonClick={handleButtonClick} />
    </div>);
}