import { ActionType, PieceAction, PieceActionSettings, PieceTrigger, PieceTriggerSettings, TriggerType } from "@activepieces/shared";
import { piecesHooks } from "@/features/pieces/lib/pieces-hook";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { ConnectionSelect } from "./connection-select";
import { PieceActionTriggerSelector } from "./piece-action-trigger-selector";
import React, { useEffect, useState } from "react";
import { typeboxResolver } from "@hookform/resolvers/typebox";
import { ActionBase, Trigger, TriggerBase } from "@activepieces/pieces-framework";
import { AutoPropertiesFormComponent } from "@/features/properties-form/components/auto-properties-form";

type PieceSettingsProps = {
  step: PieceAction | PieceTrigger
};
const PieceSettings = React.memo((props: PieceSettingsProps) => {

  const [selectedAction, setSelectedAction] = useState<ActionBase | undefined>(undefined);
  const [selectedTrigger, setSelectedTrigger] = useState<TriggerBase | undefined>(undefined);

  const { data, isLoading } = piecesHooks.usePiece({
    name: props.step.settings.pieceName,
    version: props.step.settings.pieceVersion,
  })

  const form = useForm<PieceActionSettings | PieceTriggerSettings>({
    defaultValues: props.step.settings,
    resolver: typeboxResolver(props.step.type === ActionType.PIECE ? PieceActionSettings : PieceTriggerSettings),
  });

  const controlName = props.step.type === ActionType.PIECE ? 'actionName' : 'triggerName';
  const watchedForm = form.watch(controlName);

  useEffect(() => {
    switch (props.step.type) {
      case ActionType.PIECE: {
        const actionName = (form.getValues() as PieceActionSettings).actionName
        if (actionName) {
          setSelectedAction(data?.actions[actionName]);
        }
        break;
      }
      case TriggerType.PIECE: {
        const triggerName = (form.getValues() as PieceTriggerSettings).triggerName
        if (triggerName) {
          setSelectedTrigger(data?.triggers[triggerName]);
        }
        break;
      }
    }
  }, [watchedForm]);

  return (
    <Form {...form}>
      <form className="flex flex-col gap-4 w-full" onSubmit={(e) => e.preventDefault()}>
        {data && <>
          <PieceActionTriggerSelector piece={data} isLoading={isLoading} type={props.step.type}></PieceActionTriggerSelector>
          {data.auth && selectedAction?.requireAuth && <ConnectionSelect piece={data}></ConnectionSelect>}
          {data.auth && selectedTrigger && <ConnectionSelect piece={data}></ConnectionSelect>}
        </>}
      </form>
    </Form>

  );
})

PieceSettings.displayName = 'PieceSettings';
export { PieceSettings };