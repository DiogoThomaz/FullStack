import { Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export default class NotifyCalendarGoogle {
/*
{
    "email": "diogommtdes@gmail.com",
    "summary": "Férias",
    "description": "Olá suas férias começam aqui",
    "start_time": "2023-04-09T08:00:00-03:00",
    "end_time": "2023-04-09T09:00:00-03:00"
} 
start_time: vem no formato 2023-04-07T03:00:00.000Z
converter para 2023-04-07T03:00:00-03:00

*/
public async criarEvento(email: string, summary: string, description: string, start_time: string, end_time: string): Promise<any> {
    try {
        const url = "http://localhost:8000/google/calendar/notificar/";
        const dateStart = new Date(start_time);
        const yearStart = dateStart.getUTCFullYear();
        const monthStart = ('0' + (dateStart.getUTCMonth() + 1)).slice(-2);
        const dayStart = ('0' + dateStart.getUTCDate()).slice(-2);
        const hourStart = ('0' + dateStart.getUTCHours()).slice(-2);
        const minuteStart = ('0' + dateStart.getUTCMinutes()).slice(-2);
        const secondStart = ('0' + dateStart.getUTCSeconds()).slice(-2);
        const formattedStart = `${yearStart}-${monthStart}-${dayStart}T${hourStart}:${minuteStart}:${secondStart}-03:00`;
        
        const dateEnd = new Date(end_time);
        const yearEnd = dateEnd.getUTCFullYear();
        const monthEnd = ('0' + (dateEnd.getUTCMonth() + 1)).slice(-2);
        const dayEnd = ('0' + dateEnd.getUTCDate()).slice(-2);
        const hourEnd = ('0' + dateEnd.getUTCHours()).slice(-2);
        const minuteEnd = ('0' + dateEnd.getUTCMinutes()).slice(-2);
        const secondEnd = ('0' + dateEnd.getUTCSeconds()).slice(-2);
        const formattedEnd = `${yearEnd}-${monthEnd}-${dayEnd}T${hourEnd}:${minuteEnd}:${secondEnd}-03:00`;

        const data = {
            email: email,
            summary: summary,
            description: description,
            start_time: formattedStart,
            end_time: formattedEnd
        };
        const response = await axios.post(url, data);
        return response.data;
        
    } catch (error) {
        console.log(error.message);
        return error.message;
    }
}


}