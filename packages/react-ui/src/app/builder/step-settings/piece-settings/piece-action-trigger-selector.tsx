import { PieceMetadataModel } from "@activepieces/pieces-framework";
import { ActionType, PieceActionSettings, PieceTriggerSettings, TriggerType } from "@activepieces/shared";
import { FormField, FormItem } from "@/components/ui/form";
import { useEffect, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/spinner";

type PieceActionTriggerSelectorProps = {
    piece: PieceMetadataModel
    isLoading: boolean
    type: ActionType.PIECE | TriggerType.PIECE
};

const PieceActionTriggerSelector = ({ piece, isLoading, type }: PieceActionTriggerSelectorProps) => {

    const form = useFormContext<PieceActionSettings | PieceTriggerSettings>();
    const controlName = type === ActionType.PIECE ? 'actionName' : 'triggerName';
    const watchedForm = form.watch();

    const [selectedDisplayName, setSelectedDisplayName] = useState<string | undefined>(undefined);

    useEffect(() => {
        switch (type) {
            case ActionType.PIECE: {
                const actionName = (form.getValues() as PieceActionSettings).actionName
                if (actionName) {
                    setSelectedDisplayName(piece?.actions[actionName]?.displayName);
                }
                break;
            }
            case TriggerType.PIECE: {
                const triggerName = (form.getValues() as PieceTriggerSettings).triggerName
                if (triggerName) {
                    setSelectedDisplayName(piece?.triggers[triggerName]?.displayName);
                }
                break;
            }
        }
    }, [watchedForm]);

    const options = type === ActionType.PIECE ? piece?.actions : piece?.triggers;

    return (
        <FormField name={controlName} control={form.control} render={({ field }) => (
            <FormItem>
                <Select defaultValue={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select an option" asChild>
                            <>
                                {selectedDisplayName}
                            </>
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {isLoading ? (
                            <LoadingSpinner />
                        ) : (
                            Object.values(options ?? {}).map((actionOrTrigger) => {
                                return (
                                    <SelectItem value={actionOrTrigger.name} key={actionOrTrigger.name}>
                                        <div className="flex flex-col gap-1">
                                            <span>{actionOrTrigger.displayName}</span>
                                            <span className="text-xs text-muted-foreground">{actionOrTrigger.description}</span>
                                        </div>
                                    </SelectItem>
                                );
                            })
                        )}
                    </SelectContent>
                </Select>
            </FormItem>
        )} />
    );
}

PieceActionTriggerSelector.displayName = 'PieceActionTriggerSelector';
export { PieceActionTriggerSelector };