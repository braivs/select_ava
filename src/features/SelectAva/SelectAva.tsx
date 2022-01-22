import React, {ChangeEvent, useRef, useState} from 'react';
import defaultAva from '../../assets/img/photo-profile.png'
import {Button} from "@mui/material";
import s from './SelectAva.module.scss'

export const SelectAva = () => {

    const [isEditMode, setIsEditMode] = useState(false)
    const inRef = useRef<HTMLInputElement>(null);

    const upload = (e: ChangeEvent<HTMLInputElement>) => {
        let reader = new FileReader();
        const image = new Image()
        const newFile = e.target.files && e.target.files[0];
        try {
            reader.readAsDataURL(newFile as Blob);
            reader.onload = () => {
                image.src = reader.result as string;
                image.onload = () => {
                    if (image.width === 96 && image.height === 96) console.log('Avatar ok')
                    else console.log('Avatar must be 96x96px')
                }
            };
            reader.onerror = (error) => {
            }
        } catch {
            console.log('error in reader.readAsDataURL')
        }
    }

    const goToEditModeHandler = () => {
        setIsEditMode(true)
    }

    const cancelHandler = () => {
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
        <img src={defaultAva} alt="defaultAva" className={s.img}/>
        {!isEditMode
            ? <Button variant="contained" onClick={goToEditModeHandler} className={s.button}>Edit</Button>
            : <div>
                <Button variant="contained" onClick={cancelHandler}>Cancel</Button>
                <Button variant="contained" onClick={() => inRef && inRef.current && inRef.current.click()}>Select new
                    Avatar</Button>
                <Button variant="contained" onClick={cancelHandler}>Save</Button>
            </div>
        }

    </div>
}