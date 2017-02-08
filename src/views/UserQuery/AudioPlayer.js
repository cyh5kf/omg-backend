import React, {PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
import { Spin } from 'antd';
import padStart from 'lodash/padStart';
import clamp from 'lodash/clamp';

import './AudioPlayer.less';

export default class AudioPlayer extends React.Component {
    static propTypes = {
        fileurl: PropTypes.string.isRequired,
        playduration: PropTypes.number.isRequired
    }

    static defaultProps = {
        fileurl: '',
        playduration: 0
    }

    state = {
        hasEnoughDataToPlay: false,
        playduration: 0,
        audioPlaying: false,
        audioPlayed: 0, // 毫秒
        audioPlayedUpdateTime: 0, // 播放时, 进度条上次更新的时间

        // 拖动的相关状态
        dragging: false,
        draggingPercent: 0 // 正在拖动中的百分比
    };
    getAudioNode(callback) {
        const audioNode = findDOMNode(this.refs['audio']);
        if (audioNode) {
            callback(audioNode);
        }
    }
    updatePlayedStatus = () => {
        const {audioPlaying, playduration, audioPlayed} = this.state;
        if (audioPlaying) {
            this.getAudioNode(audio => {
                const newAudioPlayed = Math.min(Math.round(audio.currentTime * 1000), playduration),
                    newState = {};
                newState.audioPlayed = newAudioPlayed;
                if (newAudioPlayed !== audioPlayed) {
                    newState.audioPlayedUpdateTime = Date.now();
                }
                this.setState(newState, () => {
                    requestAnimationFrame(this.updatePlayedStatus);
                });
            });
        }
    }
    getDraggingPercent(e) {
        const progressNode = findDOMNode(this.refs['progress']);
        if (progressNode) {
            const {left, width} = progressNode.getBoundingClientRect(),
                mouseX = e.clientX;
            return clamp(mouseX - left, 0, width) / width;
        } else {
            return 0;
        }
    };
    playAudio(audio) {
        this.setState({audioPlaying: true, audioPlayedUpdateTime: Date.now()}, () => {
            this.updatePlayedStatus();
        });
        try {
            audio.paused && audio.play();
        } catch (e) {
            //pass
        }
    }
    handleAudioCanPlay = () => this.getAudioNode(audio => {
        this.setState({
            playduration: audio.duration * 1000
        });
    });
    handleAudioPause = () => this.getAudioNode(audio => {
        // 当音频因播放结束而停止时，更新状态
        if (audio.currentTime >= audio.duration) {
            this.setState({audioPlaying: false});
        }
    });
    handlePlayBtnClick = () => this.getAudioNode(audio => {
        const {audioPlaying} = this.state;
        if (audioPlaying) {
            this.setState({
                audioPlaying: false
            });
            !audio.paused && audio.pause();
        } else {
            this.playAudio(audio);
        }
    });
    handleProgressLineMouseDown = e => {
        const {dragging, audioPlaying} = this.state,
            newState = {};
        newState.draggingPercent = this.getDraggingPercent(e);
        if (!dragging) {
            newState.dragging = true;
            if (audioPlaying) {
                this.getAudioNode(audio => audio.pause());
            }
            document.addEventListener('mouseup', this.handleDocumentMouseUp);
            document.addEventListener('mousemove', this.handleDocumentMouseMove);
        }
        this.setState(newState);
    };
    handleDocumentMouseUp = e => {
        const {audioPlaying, dragging, draggingPercent, playduration} = this.state;
        if (dragging) {
            const audioPlayed = draggingPercent * playduration;
            this.setState({
                dragging: false,
                audioPlayed: audioPlayed
            });
            this.getAudioNode(audio => {
                audio.currentTime = audioPlayed / 1000;
                if (audioPlaying) {
                    this.getAudioNode(audio => this.playAudio(audio));
                }
            });
        }
        document.removeEventListener('mouseup', this.handleDocumentMouseUp);
        document.removeEventListener('mousemove', this.handleDocumentMouseMove);
    };
    handleDocumentMouseMove = e => {
        this.setState({
            draggingPercent: this.getDraggingPercent(e)
        });
    };
    componentWillMount() {
        this.setState({playduration: this.props.playduration});
    }
    render() {
        const {fileurl} = this.props,
            {audioPlaying, audioPlayed, audioPlayedUpdateTime, playduration, dragging, draggingPercent} = this.state,
            playDurationSeconds = Math.round((audioPlayed > 0 ? audioPlayed : playduration) / 1000),
            dotPecentPos = dragging ? `${draggingPercent * 100}%` : `${audioPlayed / playduration * 100}%`,
            playPending = audioPlaying && !dragging && (Date.now() - audioPlayedUpdateTime > 300),
            amrToOgg = url => url.replace(/\.amr$/, '.ogg');
        let durationText = `${Math.floor(playDurationSeconds / 60)}:${padStart(playDurationSeconds % 60, 2, '0')}`;

        return (
            <div className={`audio-player ${playPending ? 'play-pending' : ''}`}>
                <audio ref="audio" src={amrToOgg(fileurl)}
                       onCanPlay={this.handleAudioCanPlay}
                       onPause={this.handleAudioPause}/>
                <div className={`audio-play-btn ${audioPlaying ? 'playing' : ''}`} onClick={this.handlePlayBtnClick}>
                    {playPending && <Spin/>}
                </div>
                <div ref="progress" className="audio-play-info" onMouseDown={this.handleProgressLineMouseDown}>
                    <span className="audio-baseline"/>
                    <span className="audio-played-line" style={{width: dotPecentPos}}/>
                    <span className="audio-played-dot" style={{left: dotPecentPos}}/>
                </div>
                <div className="audio-duration">{durationText}</div>
            </div>
        );
    }
}