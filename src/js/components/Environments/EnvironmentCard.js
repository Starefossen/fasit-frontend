import React from "react";
import {LifecycleStatus} from "../common/";
import FlatButton from "material-ui/FlatButton";
import {browserHistory} from "react-router";
import {Card, CardActions, CardHeader} from "material-ui/Card";
import {icons, styles} from "../../commonStyles/commonInlineStyles";
import moment from "moment";

export default function EnvironmentCard(props) {
    moment.locale("en")
    const environment =  props.environment
    const avatar = icons.environment
    const additionalCardInfo = (<div className="pull-right">
        <div className="text-muted">Changed {moment(environment.updated).fromNow()}</div>
        <br/>
        <LifecycleStatus status={environment.lifecycle.status}/>
    </div>)

    return (
        <div style={styles.cardPadding} >
            <Card>
                <CardHeader title={environment.name}
                            titleStyle={styles.bold}
                            subtitle={`Environmentclass: ${environment.environmentclass}`}
                            avatar={avatar}
                            children={additionalCardInfo}
                            onTouchTap={() => browserHistory.push('/environments/' + environment.name)}
                />
                <CardActions>
                    <FlatButton
                        disableTouchRipple={true}
                        onTouchTap={() => browserHistory.push('/environments/' + environment.name)}
                        label="manage"
                        style={styles.flatButton}/>
                </CardActions>
            </Card>
        </div>
    )
}