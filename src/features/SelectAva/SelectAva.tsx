import React, {ChangeEvent, useRef, useState} from 'react';
import defaultAva from '../../assets/img/defaultAva.png'
import {Button, Divider, Stack} from "@mui/material";
import s from './SelectAva.module.scss'
import {AppRootStateType} from "../../app/store";
import {useDispatch, useSelector} from "react-redux";
import {selectAvaAC} from "./selectAva-reducer";
import AvatarEditor from "react-avatar-editor";

export const SelectAva = () => {

    const [isEditMode, setIsEditMode] = useState(false)
    const [selectedAvaBase64, setSelectedAvaBase64] = useState('')

    const avatarFromState = useSelector<AppRootStateType, string>(state => state.ava.avatar)

    const inRef = useRef<HTMLInputElement>(null);

    const dispatch = useDispatch()

    const setEditorRef = (ed: AvatarEditor) => {
        editor = ed;
    };

    let editor: AvatarEditor;

    const upload = (e: ChangeEvent<HTMLInputElement>) => {
        let reader = new FileReader();
        const image = new Image()
        const newFile = e.target.files && e.target.files[0];
        try {
            reader.readAsDataURL(newFile as Blob);
            reader.onload = () => {
                image.src = reader.result as string;
                image.onload = () => {
                    setSelectedAvaBase64(reader.result as string)
                }
            };
            reader.onerror = (error) => {
            }
        } catch {
            console.log('error in reader.readAsDataURL')
        }
    }

    const goToEditModeHandler = () => {
        setSelectedAvaBase64(avatarFromState ? avatarFromState : defaultAva)
        setIsEditMode(true)
    }

    const cancelHandler = () => {
        setSelectedAvaBase64('')
        setIsEditMode(false)
    }

    const saveHandler = () => {
        const canvasScaled = editor.getImageScaledToCanvas();
        const croppedImg = canvasScaled.toDataURL();
        dispatch(selectAvaAC(croppedImg))
        setIsEditMode(false)
    }

    return <div className={s.selectAva}>
        <Stack spacing={2} alignItems="center">
            <input
                ref={inRef}
                type={'file'}
                accept=".jpg, .jpeg, .png"
                style={{display: 'none'}}
                onChange={upload}
            /> {/*for select file dialog*/}

            <div>Hello, User! Click edit to change you avatar.</div>
            {!isEditMode
                ? <img src={avatarFromState ? avatarFromState : defaultAva} alt="defaultAva" className={s.img}/>
                : <AvatarEditor
                    ref={setEditorRef}
                    image={selectedAvaBase64 ? selectedAvaBase64 : defaultAva}
                    width={100}
                    height={100}
                    border={50}
                    color={[255, 255, 255, 0.6]} // RGBA
                    scale={1.2}
                    rotate={0}
                />
            }
            {!isEditMode
                ? <div><Button variant="contained" onClick={goToEditModeHandler}
                               className={s.button}>Edit</Button></div>
                : <div>
                    <Stack direction={'row'}
                           divider={<Divider orientation="vertical" flexItem className={s.divider}/>}
                           spacing={2}>
                        <Button variant="contained" onClick={cancelHandler} className={s.button}>Cancel</Button>
                        <Button variant="contained"
                                onClick={() => inRef && inRef.current && inRef.current.click()}
                                className={s.button}>Select new Avatar</Button>
                        <Button variant="contained" onClick={saveHandler} className={s.button}>Save</Button>
                    </Stack>
                </div>
            }
        </Stack>


    </div>
}