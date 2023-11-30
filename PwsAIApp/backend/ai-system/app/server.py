from fastapi import FastAPI, HTTPException
from fastapi.responses import RedirectResponse, JSONResponse
from pydantic import BaseModel

from langserve import add_routes
from langchain.chat_models import ChatOpenAI

from app.tavilysearch import TavilyAgent

app = FastAPI(
    title="Langchain Server",
    version="1.0",
    description="Testing..."
)


@app.get("/")
async def redirect_root_to_docs():
    return RedirectResponse("/docs")



tavily_agent = TavilyAgent()

add_routes(
    app,
    tavily_agent.agent_chain,
    path="/tavilyagent"
)


class AgentRequest(BaseModel):
    prompt: str


@app.post("/tavilyagent/run")
async def run_agent(request: AgentRequest):
    try:
        response = tavily_agent.run_agent(request.prompt)
        return JSONResponse(content=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
