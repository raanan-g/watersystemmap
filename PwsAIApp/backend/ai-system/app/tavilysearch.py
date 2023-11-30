# libraries
import os

from langchain.agents import AgentType, initialize_agent
from langchain.chat_models import ChatOpenAI
from langchain.tools.tavily_search import TavilySearchResults
from langchain.utilities.tavily_search import TavilySearchAPIWrapper



class TavilyAgent:
    def __init__(self):
        # set up the agent
        llm = ChatOpenAI(model_name="gpt-4", temperature=0.7)
        search = TavilySearchAPIWrapper()
        tavily_tool = TavilySearchResults(api_wrapper=search)

        self.agent_chain = initialize_agent(
            [tavily_tool],
            llm,
            agent=AgentType.STRUCTURED_CHAT_ZERO_SHOT_REACT_DESCRIPTION,
            verbose=True,
        )

    def run_agent(self, prompt: str):
        return self.agent_chain.run(prompt)