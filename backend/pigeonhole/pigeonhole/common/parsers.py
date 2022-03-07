from datetime import datetime

from django.utils.timezone import make_aware

from .constants import CREATED_AT, ID, UPDATED_AT
from .models import TimestampedModel


def parse_datetime_to_ms_timestamp(date: datetime) -> int:
    return round(date.timestamp() * 1000)


def parse_ms_timestamp_to_datetime(ms_timestamp: int) -> datetime:
    return make_aware(datetime.fromtimestamp(ms_timestamp / 1000))


def to_base_json(model: TimestampedModel) -> dict:
    return {
        ID: model.id,
        CREATED_AT: parse_datetime_to_ms_timestamp(model.created_at),
        UPDATED_AT: parse_datetime_to_ms_timestamp(model.updated_at),
    }
