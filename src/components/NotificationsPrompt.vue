<template>
  <v-dialog :value="value" @input="$emit('input', $event)">
    <v-card>
      <v-card-title>Do you want to receive some notifications?</v-card-title>

      <v-card-actions>
        <v-btn @click="submit">Yes</v-btn>
        <v-btn @click="cancel">No</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ChatService from '../services/chat.service';
import NotificationService from '../services/notification.service';

const notificationService = new NotificationService(ChatService.sender.id);

export default {
  name: "NotificationsPrompt",
  props: {
    value: Boolean,
  },
  created() {
      notificationService.init();
  },
  methods: {
    async submit() {
      notificationService.askPermission();

      this.$emit('input', false);
    },
    cancel() {
      this.$emit('input', false);
      !localStorage.setItem('push-notifications', true);
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
