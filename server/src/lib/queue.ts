/**
 * Simple in-memory queue implementation.
 * In production, replace with Redis or supabase-queue.
 */

type QueueJob<T = any> = {
  id: string;
  type: string;
  payload: T;
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
  scheduledFor?: Date;
};

class SimpleQueue {
  private jobs: Map<string, QueueJob> = new Map();
  private processing: Set<string> = new Set();

  async enqueue<T>(
    type: string,
    payload: T,
    options: { maxAttempts?: number; delay?: number } = {}
  ): Promise<string> {
    const id = `${type}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const job: QueueJob<T> = {
      id,
      type,
      payload,
      attempts: 0,
      maxAttempts: options.maxAttempts || 3,
      createdAt: new Date(),
      scheduledFor: options.delay ? new Date(Date.now() + options.delay) : undefined,
    };

    this.jobs.set(id, job);
    console.log(`[Queue] Enqueued job ${id} of type ${type}`);
    return id;
  }

  async dequeue(type: string): Promise<QueueJob | null> {
    const now = new Date();
    for (const [id, job] of this.jobs.entries()) {
      if (
        job.type === type &&
        !this.processing.has(id) &&
        (!job.scheduledFor || job.scheduledFor <= now) &&
        job.attempts < job.maxAttempts
      ) {
        this.processing.add(id);
        job.attempts++;
        return job;
      }
    }
    return null;
  }

  async complete(jobId: string): Promise<void> {
    this.jobs.delete(jobId);
    this.processing.delete(jobId);
    console.log(`[Queue] Completed job ${jobId}`);
  }

  async fail(jobId: string, error: Error): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) return;

    this.processing.delete(jobId);
    console.error(`[Queue] Job ${jobId} failed (attempt ${job.attempts}/${job.maxAttempts}):`, error);

    if (job.attempts >= job.maxAttempts) {
      this.jobs.delete(jobId);
      console.error(`[Queue] Job ${jobId} exceeded max attempts, removing from queue`);
    } else {
      // Exponential backoff
      const delay = Math.pow(2, job.attempts) * 1000;
      job.scheduledFor = new Date(Date.now() + delay);
    }
  }

  getStats() {
    return {
      total: this.jobs.size,
      processing: this.processing.size,
      pending: this.jobs.size - this.processing.size,
    };
  }
}

export const queue = new SimpleQueue();
