import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from aibot.ws import WsConnectionManager


class _DummyLogger:
    def debug(self, *_args, **_kwargs):
        pass

    def info(self, *_args, **_kwargs):
        pass

    def warn(self, *_args, **_kwargs):
        pass

    def error(self, *_args, **_kwargs):
        pass


def test_connect_disables_system_proxy_when_websockets_supports_proxy(monkeypatch):
    captured_kwargs = {}

    async def fake_connect(_url, **kwargs):
        captured_kwargs.update(kwargs)

        class _WS:
            async def close(self):
                return None

        return _WS()

    manager = WsConnectionManager(_DummyLogger())

    async def _noop_auth():
        return None

    monkeypatch.setattr("aibot.ws.websockets.connect", fake_connect)
    monkeypatch.setattr(manager, "_send_auth", _noop_auth)
    def _fake_ensure_future(coro):
        coro.close()
        return None

    monkeypatch.setattr("aibot.ws.asyncio.ensure_future", _fake_ensure_future)

    asyncio.run(manager.connect())

    assert captured_kwargs.get("proxy", "__missing__") is None
