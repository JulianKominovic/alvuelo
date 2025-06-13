use std::{clone, sync::Arc};

#[cfg(target_os = "linux")]
pub mod linux;
pub trait MultimediaTrait {
    fn new() -> Self;
    fn play(&self);
    fn pause(&self);
    fn stop(&self);
    fn is_playing(&self) -> bool;
    fn seek(&self, position: f64);
    fn set_volume(&self, volume: f64);
    fn get_volume(&self) -> f64;
    fn set_mute(&self, mute: bool);
    fn get_mute(&self) -> bool;
    fn set_rate(&self, rate: f64);
    fn get_rate(&self) -> f64;
    fn set_position(&self, position: f64);
    fn get_position(&self) -> f64;
    fn get_metadata(&self) -> MultimediaMetadataStruct;
    fn on_multimedia_change(&self, callback: Box<dyn Fn() + Send + Sync + 'static>);
}
#[derive(Clone, Debug, serde::Serialize, serde::Deserialize)]
pub struct MultimediaMetadataStruct {
    pub title: String,
    pub artists: Vec<String>,
    pub album: String,
    pub year: u32,
    pub genre: String,
    pub duration: f64,
    pub cover_url: String,
}

#[derive(Clone, serde::Serialize, serde::Deserialize)]
pub struct MultimediaFrontendStruct {
    pub metadata: MultimediaMetadataStruct,
    pub volume: f64,
    pub mute: bool,
    pub playing: bool,
    pub position: f64,
}
#[derive(Clone)]
pub struct MultimediaStruct {
    pub on_multimedia_change: Arc<Box<dyn Fn() + Send + Sync + 'static>>,
    callback: Option<Arc<Box<dyn Fn() + Send + Sync + 'static>>>,
}
