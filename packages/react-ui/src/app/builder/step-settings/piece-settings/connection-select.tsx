import { Plus } from 'lucide-react';
import React from 'react';

import {
    Select,
    SelectAction,
    SelectContent,
    SelectItem,
    SelectLoader,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { PieceMetadataModel, PieceMetadataModelSummary } from '@activepieces/pieces-framework';
import { CreateOrEditConnectionDialog } from '../../../../features/connections/components/create-edit-connection-dialog';
import { appConnectionsHooks } from '../../../../features/connections/lib/app-connections-hooks';
import { authenticationSession } from '@/lib/authentication-session';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm, useFormContext } from 'react-hook-form';
import { PieceActionSettings, PieceTriggerSettings } from '../../../../../../shared/src';

type ConnectionSelectProps = {
    piece: PieceMetadataModelSummary | PieceMetadataModel
};
const ConnectionSelect = React.memo((params: ConnectionSelectProps) => {
    const [connectionDialogOpen, setConnectionDialogOpen] = React.useState(false);
    const [selectConnectionOpen, setSelectConnectionOpen] = React.useState(false);

    const form = useFormContext<PieceActionSettings | PieceTriggerSettings>();
    const { data: connectionsPage, isLoading, refetch } = appConnectionsHooks.useConnections({
        pieceName: params.piece.name,
        cursor: undefined,
        limit: 100,
        projectId: authenticationSession.getProjectId(),
    })

    return (
        <>
            <FormField
                control={form.control}
                name="input.auth"
                render={({ field }) => (
                    <FormItem>
                        <CreateOrEditConnectionDialog
                            piece={params.piece}
                            onConnectionCreated={(connectionName) => {
                                refetch();
                                field.onChange(connectionName);
                            }}
                            open={connectionDialogOpen}
                            setOpen={setConnectionDialogOpen}
                        ></CreateOrEditConnectionDialog>
                        <FormLabel>Connection</FormLabel>
                        <Select open={selectConnectionOpen} onOpenChange={setSelectConnectionOpen} defaultValue={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a connection" />
                            </SelectTrigger>
                            <SelectContent>
                                {isLoading && <SelectLoader />}
                                {!isLoading && <>
                                    <SelectAction
                                        onClick={() => {
                                            setSelectConnectionOpen(false);
                                            setConnectionDialogOpen(true);
                                        }}
                                    >
                                        <span className="flex items-center gap-1 text-primary w-full">
                                            <Plus size={16} />
                                            Create Connection
                                        </span>
                                    </SelectAction>

                                    {connectionsPage?.data && connectionsPage.data.map((connection) => {
                                        return <SelectItem value={connection.name} key={connection.name}>
                                            {connection.name}
                                        </SelectItem>
                                    })}
                                </>}

                            </SelectContent>
                        </Select>
                    </FormItem>
                )}
            ></FormField>
        </>
    );
});

ConnectionSelect.displayName = 'ConnectionSelect';
export { ConnectionSelect };