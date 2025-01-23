import { Button } from "./Button"

const removeChar = '×'

export function ButtonPanel({onButtonClick}) {
    return (<div className="button-panel">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) =>
            <Button
                key={i}
                displayValue={i > 0 ? i : removeChar}
                value={i}
                onClick={onButtonClick}
            />
        )}
    </div>)

}