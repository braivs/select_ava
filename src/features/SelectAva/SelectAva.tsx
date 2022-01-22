import React, {ChangeEvent, useRef, useState} from 'react';
import defaultAva from '../../assets/img/defaultAva.png'
import {Button, Divider, Stack} from "@mui/material";
import s from './SelectAva.module.scss'
import {AppRootStateType} from "../../app/store";
import {useDispatch, useSelector} from "react-redux";
import {selectAvaAC} from "./selectAva-reducer";

export const SelectAva = () => {

    const [isEditMode, setIsEditMode] = useState(false)
    const [error, setError] = useState(false)
    const [selectedAvaBase64, setSelectedAvaBase64] = useState('')
    const avatarFromState = useSelector<AppRootStateType, string>(state => state.ava.avatar)
    const inRef = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch()

    const upload = (e: ChangeEvent<HTMLInputElement>) => {
        let reader = new FileReader();
        const image = new Image()
        const newFile = e.target.files && e.target.files[0];
        try {
            reader.readAsDataURL(newFile as Blob);
            reader.onload = () => {
                image.src = reader.result as string;
                image.onload = () => {
                    if (image.width === 96 && image.height === 96) {
                        setError(false)
                        setSelectedAvaBase64(reader.result as string)
                    } else setError(true)
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
        setError(false)
    }

    const saveHandler = () => {
        if (selectedAvaBase64) dispatch(selectAvaAC(selectedAvaBase64))
        setSelectedAvaBase64('')
        setIsEditMode(false)
        setError(false)
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
            <div>Note: you avatar must be 96x96px.</div>
            <img src={
                isEditMode
                    ? (selectedAvaBase64 ? selectedAvaBase64 : defaultAva)
                    : (avatarFromState ? avatarFromState : defaultAva)
            } alt="defaultAva" className={s.img}/>
            {isEditMode && error && <div className={s.error}>Avatar must be 96x96px</div>}
            {!isEditMode
                ? <div><Button variant="contained" onClick={goToEditModeHandler}
                                        className={s.button}>Edit</Button></div>
                : <Stack direction={'row'}
                         divider={<Divider orientation="vertical" flexItem className={s.divider}/>}
                         spacing={2}>
                    <Button variant="contained" onClick={cancelHandler} className={s.button}>Cancel</Button>
                    <Button variant="contained"
                                          onClick={() => inRef && inRef.current && inRef.current.click()}
                                          className={s.button}>Select new Avatar</Button>
                    <Button variant="contained" onClick={saveHandler} className={s.button}>Save</Button>
                </Stack>
            }
        </Stack>


    </div>
}