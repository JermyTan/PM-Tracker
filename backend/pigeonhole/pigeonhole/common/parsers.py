from typing import Optional
from datetime import datetime

from django.utils.timezone import get_default_timezone

from .constants import CREATED_AT, ID, UPDATED_AT
from .models import TimestampedModel


def parse_datetime_to_ms_timestamp(date_time: Optional[datetime]) -> Optional[int]:
    return round(date_time.timestamp() * 1000) if date_time is not None else None


def parse_ms_timestamp_to_datetime(ms_timestamp: Optional[int]) -> Optional[datetime]:
    return (
        datetime.fromtimestamp(ms_timestamp / 1000, tz=get_default_timezone())
        if ms_timestamp is not None
        else None
    )


def to_base_json(model: TimestampedModel) -> dict:
    return {
        ID: model.id,
        CREATED_AT: parse_datetime_to_ms_timestamp(model.created_at),
        UPDATED_AT: parse_datetime_to_ms_timestamp(model.updated_at),
    }
