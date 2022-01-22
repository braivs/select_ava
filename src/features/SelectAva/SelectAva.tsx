import React, {ChangeEvent, useRef, useState} from 'react';
import defaultAva from '../../assets/img/photo-profile.png'
import {Button} from "@mui/material";
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
                    }
                    else setError(true)
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
        if (selectedAvaBase64) dispatch(selectAvaAC(selectedAvaBase64))
        setSelectedAvaBase64('')
        setIsEditMode(false)
    }

    return <div className={s.selectAva}>
        <input
            ref={inRef}
            type={'file'}
            accept=".jpg, .jpeg, .png"
            style={{display: 'none'}}
            onChange={upload}
        /> {/*for select file dialog*/}

        <div>Hello, User! You can change you avatar by click edit button below.</div>
        <img src={
            isEditMode
                ? (selectedAvaBase64 ? selectedAvaBase64 : defaultAva)
                : (avatarFromState ? avatarFromState : defaultAva)
        } alt="defaultAva" className={s.img}/>
        {isEditMode && error && <div className={s.error}>Avatar must be 96x96px</div>}
        {!isEditMode
            ? <Button variant="contained" onClick={goToEditModeHandler} className={s.button}>Edit</Button>
            : <div>
                <Button variant="contained" onClick={cancelHandler}>Cancel</Button>
                <Button variant="contained" onClick={() => inRef && inRef.current && inRef.current.click()}>Select new
                    Avatar</Button>
                <Button variant="contained" onClick={saveHandler}>Save</Button>
            </div>
        }

    </div>
}