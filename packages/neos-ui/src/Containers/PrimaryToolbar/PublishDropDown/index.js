import React, {PureComponent, PropTypes} from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$transform, $get} from 'plow-js';

import Icon from '@neos-project/react-ui-components/lib/Icon/';
import CheckBox from '@neos-project/react-ui-components/lib/CheckBox/';
import Label from '@neos-project/react-ui-components/lib/Label/';
import DropDown from '@neos-project/react-ui-components/lib/DropDown/';

import I18n, {i18nService} from '@neos-project/neos-ui-i18n';
import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';

const {publishableNodesSelector, publishableNodesInDocumentSelector, baseWorkspaceSelector} = selectors.CR.Workspaces;

import AbstractButton from './AbstractButton/index';
import WorkspaceSelector from './WorkspaceSelector/index';
import style from './style.css';

@connect($transform({
    isSaving: $get('ui.remote.isSaving'),
    isPublishing: $get('ui.remote.isPublishing'),
    isDiscarding: $get('ui.remote.isDiscarding'),
    publishableNodes: publishableNodesSelector,
    publishableNodesInDocument: publishableNodesInDocumentSelector,
    baseWorkspace: baseWorkspaceSelector,
    isAutoPublishingEnabled: $get('user.settings.isAutoPublishingEnabled')
}), {
    toggleAutoPublishing: actions.User.Settings.toggleAutoPublishing,
    changeBaseWorkspaceAction: actions.CR.Workspaces.changeBaseWorkspace,
    publishAction: actions.CR.Workspaces.publish,
    discardAction: actions.CR.Workspaces.discard
})
@neos()
export default class PublishDropDown extends PureComponent {
    static propTypes = {
        isSaving: PropTypes.bool,
        isPublishing: PropTypes.bool,
        isDiscarding: PropTypes.bool,
        publishableNodes: ImmutablePropTypes.list,
        publishableNodesInDocument: ImmutablePropTypes.list,
        baseWorkspace: PropTypes.string.isRequired,
        neos: PropTypes.object.isRequired,
        isAutoPublishingEnabled: PropTypes.bool,
        toggleAutoPublishing: PropTypes.func.isRequired,
        publishAction: PropTypes.func.isRequired,
        discardAction: PropTypes.func.isRequired,
        changeBaseWorkspaceAction: PropTypes.func.isRequired,
        translations: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.handlePublishClick = this.handlePublishClick.bind(this);
        this.handlePublishAllClick = this.handlePublishClick.bind(this);
        this.handleDiscardClick = this.handleDiscardClick.bind(this);
        this.handleDiscardAllClick = this.handleDiscardAllClick.bind(this);
    }

    render() {
        const {
            publishableNodes,
            publishableNodesInDocument,
            isSaving,
            isAutoPublishingEnabled,
            toggleAutoPublishing,
            baseWorkspace,
            changeBaseWorkspaceAction,
            neos,
            translations
        } = this.props;
        const translate = i18nService(translations);

        const allowedWorkspaces = $get('configuration.allowedTargetWorkspaces', neos);
        const baseWorkspaceTitle = $get([baseWorkspace, 'title'], allowedWorkspaces);
        const canPublishLocally = publishableNodesInDocument && (publishableNodesInDocument.count() > 0);
        const canPublishGlobally = publishableNodes && (publishableNodes.count() > 0);
        const changingWorkspaceAllowed = !canPublishGlobally;
        const autoPublishWrapperClassNames = mergeClassNames({
            [style.dropDown__item]: true,
            [style['dropDown__item--noHover']]: true
        });
        const {mainButtonLabel, mainButtonTarget} = this.getMainButtonLabeling();
        const dropDownBtnClassName = mergeClassNames({
            [style.dropDown__btn]: true,
            [style['dropDown__item--canPublish']]: canPublishGlobally
        });

        return (
            <div className={style.wrapper}>
                <AbstractButton
                    className={style.publishBtn}
                    isEnabled={canPublishLocally || isSaving}
                    isHighlighted={canPublishLocally || isSaving}
                    indicator={publishableNodesInDocument ? publishableNodesInDocument.count() : 0}
                    onClick={this.handlePublishClick}
                    >
                    <I18n fallback={mainButtonTarget} id={mainButtonLabel}/> <I18n id="to"/> {baseWorkspaceTitle}
                </AbstractButton>

                <DropDown className={style.dropDown}>
                    <DropDown.Header
                        className={dropDownBtnClassName}
                        />

                    <DropDown.Contents
                        className={style.dropDown__contents}
                        >
                        <li className={style.dropDown__item}>
                            <WorkspaceSelector
                                baseWorkspace={baseWorkspace}
                                allowedWorkspaces={allowedWorkspaces}
                                changeBaseWorkspaceAction={changeBaseWorkspaceAction}
                                changingWorkspaceAllowed={changingWorkspaceAllowed}
                                translate={translate}
                                />
                        </li>
                        <li className={style.dropDown__item}>
                            <AbstractButton
                                isEnabled={canPublishGlobally}
                                isHighlighted={false}
                                indicator={publishableNodes ? publishableNodes.count() : 0}
                                onClick={this.handlePublishAllClick}
                                >
                                <Icon icon="upload"/>
                                <I18n fallback="Publish All" id="publishAll"/>
                            </AbstractButton>
                        </li>
                        <li className={style.dropDown__item}>
                            <AbstractButton
                                isEnabled={canPublishLocally}
                                isHighlighted={false}
                                indicator={publishableNodesInDocument ? publishableNodesInDocument.count() : 0}
                                label="Discard"
                                icon="ban"
                                onClick={this.handleDiscardClick}
                                >
                                <Icon icon="ban"/>
                                <I18n fallback="Discard" id="discard"/>
                            </AbstractButton>
                        </li>
                        <li className={style.dropDown__item}>
                            <AbstractButton
                                isEnabled={canPublishGlobally}
                                isHighlighted={false}
                                indicator={publishableNodes ? publishableNodes.count() : 0}
                                onClick={this.handleDiscardAllClick}
                                >
                                <Icon icon="ban"/>
                                <I18n fallback="Discard All" id="discardAll"/>
                            </AbstractButton>
                        </li>
                        <li className={autoPublishWrapperClassNames}>
                            <Label htmlFor="neos__primaryToolbar__publishDropDown__autoPublishingEnabledCheckbox">
                                <CheckBox
                                    id="neos__primaryToolbar__publishDropDown__autoPublishingEnabledCheckbox"
                                    onChange={toggleAutoPublishing}
                                    isChecked={isAutoPublishingEnabled}
                                    />
                                <I18n id="autoPublish" fallback="Auto-Publish"/>
                            </Label>
                        </li>
                        <li className={style.dropDown__item}>
                            <a href="/neos/management/workspaces">
                                <Icon icon="th-large"/>
                                <I18n fallback="Workspaces" id="workspaces"/>
                            </a>
                        </li>
                    </DropDown.Contents>
                </DropDown>
            </div>
        );
    }

    getMainButtonLabeling() {
        const {
            publishableNodesInDocument,
            isSaving,
            isPublishing,
            isDiscarding,
            isAutoPublishingEnabled
        } = this.props;
        const canPublishLocally = publishableNodesInDocument && (publishableNodesInDocument.count() > 0);

        if (isSaving) {
            return {
                mainButtonLabel: 'saving',
                mainButtonTarget: 'Saving...'
            };
        }

        if (isPublishing) {
            return {
                mainButtonLabel: 'publishing',
                mainButtonTarget: 'Publishing...'
            };
        }

        if (isDiscarding) {
            return {
                mainButtonLabel: 'discarding',
                mainButtonTarget: 'Discarding...'
            };
        }

        if (isAutoPublishingEnabled) {
            return {
                mainButtonLabel: 'autoPublish',
                mainButtonTarget: 'Auto-Publish'
            };
        }

        if (canPublishLocally) {
            return {
                mainButtonLabel: 'publish',
                mainButtonTarget: 'Publish'
            };
        }

        return {
            mainButtonLabel: 'published',
            mainButtonTarget: 'Published'
        };
    }

    handlePublishClick() {
        const {publishableNodesInDocument, publishAction, baseWorkspace} = this.props;

        publishAction(publishableNodesInDocument.map($get('contextPath')), baseWorkspace);
    }

    handlePublishAllClick() {
        const {publishableNodes, publishAction, baseWorkspace} = this.props;
        publishAction(publishableNodes.map($get('contextPath')), baseWorkspace);
    }

    handleDiscardClick() {
        const {publishableNodesInDocument, discardAction} = this.props;

        discardAction(publishableNodesInDocument.map($get('contextPath')));
    }

    handleDiscardAllClick() {
        const {publishableNodes, discardAction} = this.props;

        discardAction(publishableNodes.map($get('contextPath')));
    }
}
