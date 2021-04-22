import { Component } from '@angular/core';
import { from } from 'rxjs';
import {AlertController, NavController, LoadingController } from '@ionic/angular';

import { GameDataService } from '../services/game-data.service'
import { SettingsService } from '../services/settings.service'
import { WordRandomService } from '../services/word-random.service'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private alertCtrl: AlertController,
    private navCtrl: NavController, 
    private loader: LoadingController,
    private data: GameDataService,
    private settings: SettingsService,
    private randomWord: WordRandomService) {
}
ngOnInit() { 
  // If app is launched for the first time, language is asked
  if(!this.settings.initialized){
    this.askLanguage();
  }else{
    // Reset if app is just opened (no word yet)
    if(this.data.word == ""){
      this.reset();
    }else if(this.data.dictionary !== this.settings.settings.dictionary){
      // Dictionary has been changed, word needs to be reset
      this.data.dictionary = this.settings.settings.dictionary;
      this.reset();
    }
  }
}
  async askLanguage() {
  let inputs = this.settings.languages.map((lang) =>  {
    return {
      type: 'radio',
      label: this.settings.lang[lang],
      value: lang,
      checked: lang == 'english'
    }
  });
  var resultArray = Object.keys(inputs).map(function(inputsIndex){
    let input = inputs[inputsIndex];
    // do something with input
    return input;
  });
  let alert = await this.alertCtrl.create({
    header: 'Select language',
    inputs: resultArray,
    buttons: [{
      text: 'Continue',
      handler: lang => {
        this.settings.updateLanguage(lang).then(() => {
          this.settings.updateDictionary(lang).then(() => {
            this.showStory();
            this.data.dictionary = lang;
            this.data.reset_game();
          });
        });
      }
    }],
    backdropDismiss: false,
    cssClass: 'language_screen'
  })
  alert.present();
}

// Shows story of the game
async showStory(){
  let storyScreen = await this.alertCtrl.create({
    header: this.settings.lang.story,
    message: this.settings.lang.story_content,
    buttons: [
      {
        text: this.settings.lang.continue,
        cssClass: 'game_over_button'
      }
    ],
    backdropDismiss: false,
    cssClass: 'story_screen'
  });
  await storyScreen.present();
}

// Guesses an alphabet
// If alphabet is in the word, more of the word is revealed.
// Otherwise guesses are reduced.
// Game ends once word has been guessed or all guesses have been used.
guess(a){
  if(this.data.guess(a)){
      this.gameOver();
  }
}

// Resets the game (gives a new word)
  async reset(){
  let loading = await this.loader.create({
    message: 'Loading words...'
  })
  loading.present();

  this.data.reset_game().then(() => loading.dismiss());
}

// Gives game over screen and adds victory/loss
  async gameOver(){
  let gameOverScreen = await this.alertCtrl.create({
    header: this.data.victory ? this.settings.lang.victory : this.settings.lang.game_over,
    message: this.data.victory ? this.settings.lang.victory_message + this.data.word + "." :
      this.settings.lang.game_over_message + this.data.word + ".",
    buttons: [
      {
        text: this.settings.lang.play_again,
        handler: () => {
          this.reset();
        }
      }
    ],
    backdropDismiss: false,
    cssClass: 'game_over_screen'
  });
  if(this.data.victory){
    this.data.add_victory();
  }else{
    this.data.add_loss();
  }
  gameOverScreen.present();
}

nextPage(){
  
}

prevPage(){
  
}

}
