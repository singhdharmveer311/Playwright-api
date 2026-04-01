
export class APILogger{

    // Stores request/response log entries in memory so tests can inspect them later.
    private recentLogs: any[] = []

    logRequest(method: string, url: string, headers: Record<string, string>, body?: any){
        // Group request details into one object instead of logging loose values separately.
        const logEntry = {method, url, headers, body}
        // Push one structured request event into the log history.
        this.recentLogs.push({type: 'Request Details', data: logEntry});
    }

    logResponse(statusCode: number, body?: any){
        // Response is stored separately because it happens after the request and has different fields.
        const logEntry = {statusCode, body}
        this.recentLogs.push({type: "Response Details", data: logEntry})
    }

    getRecentLogs(){
        // Convert each log object into a readable string block for debugging/output.
        const logs = this.recentLogs.map(log => {
            return `=== ${log.type} ===\n${JSON.stringify(log.data, null, 4)}`
        }).join('\n\n')

        // Returns the raw array right now; return `logs` instead if you want formatted text output.
        return this.recentLogs;
    }

}
