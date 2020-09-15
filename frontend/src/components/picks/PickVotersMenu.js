import React from "react";
import {
    Box, Menu, Text
} from 'grommet';
import { Trash } from 'grommet-icons';
import { connect } from "react-redux";

import { cancelVote } from "../../store/actions/pickActions";


import ConfirmationLayer from "../lib/ConfirmationLayer";

const PickVotersMenu = ({ userId, voters, hideAction, cancelVote, ...props }) => {
    const [openConfirm, setOpenConfirm] = React.useState();
    const [clickedVoter, setClickedVoter] = React.useState();
    const onCloseConfirm = () => setOpenConfirm(undefined);
    const onConfirmAndClose = () => {
        setOpenConfirm(undefined);
        cancelVote(clickedVoter);
    }
    let summaryLabel = voters ? voters.length : 0;
    const hasVoters = (voters && voters.length > 0);
    let votersItems = [];
    if (hasVoters) {
        votersItems = voters.map(v => {
            return {
                label: <Box pad="small" alignSelf="center">{v.name}</Box>,
                icon: (!hideAction && userId !== v.id) ? <Box alignSelf="center"><Trash /></Box> : undefined,
                gap: "small",
                reverse: true,
                onClick: (!hideAction && userId !== v.id) ? () => { setClickedVoter(v); setOpenConfirm(true) } : undefined
            }
        });
    }
    return <Box align="center" justify="center" {...props} >
        <Menu dropProps={{
            align: { top: 'bottom', left: 'left' },
            elevation: 'medium',
        }}
            label={<Text weight="bold">{summaryLabel}</Text>}
            items={votersItems}
            disabled={votersItems.length === 0}
            focusIndicator={false} />
        {openConfirm && (
            <ConfirmationLayer onCancelAction={onCloseConfirm} onConfirmAction={onConfirmAndClose}
                title="Confirmation" text={`Supprimer le vote de ${clickedVoter.name} ?`} actionLabel="Supprimer" />
        )}
    </Box>
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        cancelVote: (vote) => dispatch(cancelVote(ownProps.pickId, vote))
    }
}

export default connect(null, mapDispatchToProps)(PickVotersMenu);